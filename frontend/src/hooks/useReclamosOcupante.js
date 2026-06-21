import { useEffect, useMemo, useState } from "react";

import {
  getIncidencias,
  createIncidencia,
  subirFotosIncidencia,
} from "../services/incidenciasService";

import { getTrabajos } from "../services/trabajosService";
import { getEdificios } from "../services/edificiosService";
import { getUnidades } from "../services/unidadesService";

import { useAuth } from "./useAuth";

const RECLAMO_INICIAL = {
  titulo: "",
  descripcion: "",
  ubicacion: "",
  categoria: "",
  prioridad: "",
  archivos: [],
};
// Adaptado
function adaptarIncidencia(inc, trabajos = []) {
  const trabajosAsociados = trabajos.filter((t) => {
	const incId = t.incidenciaId?._id || t.incidenciaId;
	return incId === inc._id;
  });

  return {
	id: inc._id,
	_id: inc._id,
	titulo: inc.titulo,
	descripcion: inc.descripcion || "",
	fecha: inc.createdAt
  	? new Date(inc.createdAt).toLocaleDateString("es-AR")
  	: "",
	estado: inc.estado,
	categoria: inc.categoria,
	prioridad: inc.prioridad,
	ubicacion: inc.espacio || "",
	archivos: (inc.fotos || []).map((url, idx) => ({
  	name: `Foto ${idx + 1}`,
  	url,
	})),
	trabajoAsociado:
  	trabajosAsociados.length > 0
    	? `${trabajosAsociados.length} trabajo(s) asociado(s)`
    	: "Sin trabajo asociado",
  };
}

export function useReclamosOcupante() {
  const { user } = useAuth();

  const [reclamos, setReclamos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [miUnidad, setMiUnidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState(null);

  const [isNuevoReclamoOpen, setIsNuevoReclamoOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formReclamo, setFormReclamo] = useState(RECLAMO_INICIAL);

  // Carga inicial
  const cargarReclamos = async () => {
	try {
  	setLoading(true);
  	setError("");

  	// El back filtra automáticamente por el ocupante logueado
  	const [incidenciasData, trabajos, edificiosData,unidadesData] = await Promise.all([
    	getIncidencias(),
    	getTrabajos(),
    	getEdificios(),
        getUnidades(),
  	]);

    // Buscar la unidad donde este ocupante es el actual vigente
    if (user?._id || user?.id) {
    const userId = user._id || user.id;
    const miUnidadEncontrada = unidadesData.find((u) =>
        u.unidadRelaciones?.some(
        (rel) =>
            rel.esOcupanteActual === true &&
            rel.estado === "VIGENTE" &&
            String(rel.ocupanteId?._id || rel.ocupanteId) === String(userId)
        )
    );
    setMiUnidad(miUnidadEncontrada || null);
    }

  	const adaptados = incidenciasData.map((inc) =>
    	adaptarIncidencia(inc, trabajos)
  	);
  	setReclamos(adaptados);
  	setEdificios(edificiosData || []);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar los reclamos";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  useEffect(() => {
	cargarReclamos();
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtros
  const reclamosFiltrados = useMemo(() => {
	if (estadoFiltro === "Todos") return reclamos;
	return reclamos.filter((r) => r.estado === estadoFiltro);
  }, [reclamos, estadoFiltro]);

  // Unidad actual (mostramos info básica)
  const unidadActual = useMemo(() => {
  const edificio =
	miUnidad?.edificioId?.nombre || edificios[0]?.nombre || "—";
  return {
	ocupante: user
  	? `${user.nombre || user.name || ""} ${user.apellido || user.lastName || ""}`.trim()
  	: "Ocupante",
	numero: miUnidad?.numero || "—",
	piso: miUnidad?.piso || "—",
	torre: edificio,
	edificio,
  };
    }, [user, edificios, miUnidad]);



  // Modal nuevo reclamo
  const handleAbrirNuevoReclamo = () => {
	setFormReclamo(RECLAMO_INICIAL);
	setIsNuevoReclamoOpen(true);
  };

  const handleCerrarNuevoReclamo = () => {
	setIsNuevoReclamoOpen(false);
  };

  const handleChangeReclamo = (campo, valor) => {
	setFormReclamo((prev) => ({
  	...prev,
  	[campo]: valor,
	}));
  };

 const handleCrearReclamo = async () => {
  if (!formReclamo.titulo?.trim()) {
	alert("Ingresá el título.");
	return;
  }
  if (!formReclamo.descripcion?.trim()) {
	alert("Ingresá la descripción.");
	return;
  }
  if (!formReclamo.categoria) {
	alert("Seleccioná una categoría.");
	return;
  }

  const edificioId = edificios[0]?._id;
  if (!edificioId) {
	alert("No hay edificio disponible para asociar el reclamo.");
	return;
  }

  try {
	const payload = {
  	edificioId,
  	titulo: formReclamo.titulo.trim(),
  	descripcion: formReclamo.descripcion.trim(),
  	categoria: formReclamo.categoria,
  	prioridad: formReclamo.prioridad || "media",
  	espacio: formReclamo.ubicacion?.trim() || null,
	};

	// 1. Crear la incidencia
	const incidenciaCreada = await createIncidencia(payload);

	// 2. Si hay archivos, subirlos a la incidencia recién creada
	if (formReclamo.archivos?.length > 0 && incidenciaCreada?._id) {
  	const formData = new FormData();
  	formReclamo.archivos.forEach((archivo) => {
    	formData.append("fotos", archivo);
  	});

  	try {
    	await subirFotosIncidencia(incidenciaCreada._id, formData);
  	} catch (uploadErr) {
    	console.warn("No se pudieron subir las fotos:", uploadErr);
    	// No bloqueamos: la incidencia se creó OK, solo falló el upload
  	}
	}

	setIsNuevoReclamoOpen(false);
	setIsSuccessOpen(true);
	setFormReclamo(RECLAMO_INICIAL);
  } catch (err) {
	const msg =
  	err?.response?.data?.message ||
  	err?.message ||
  	"No se pudo crear el reclamo";
	alert(msg);
  }
};

  const cerrarSuccess = async () => {
	setIsSuccessOpen(false);
	await cargarReclamos();
  };

  // Selección de detalle
  const abrirDetalleReclamo = (reclamo) => setReclamoSeleccionado(reclamo);
  const cerrarDetalleReclamo = () => setReclamoSeleccionado(null);

  return {
	reclamosFiltrados,
	loading,
	error,
	unidadActual,

	estadoFiltro,
	setEstadoFiltro,

	reclamoSeleccionado,
	abrirDetalleReclamo,
	cerrarDetalleReclamo,

	isNuevoReclamoOpen,
	handleAbrirNuevoReclamo,
	handleCerrarNuevoReclamo,
	formReclamo,
	handleChangeReclamo,
	handleCrearReclamo,

	isSuccessOpen,
	cerrarSuccess,
  };
}

