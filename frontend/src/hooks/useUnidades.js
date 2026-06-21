import { useEffect, useMemo, useState } from "react";

import {
  getUnidades,
  updateUnidad,
  desvincularOcupante,
} from "../services/unidadesService";

import { getIncidencias } from "../services/incidenciasService";

import { clonarDato } from "../pages/admin/unidades/utils/clonarDatos";
import { filtrarUnidades } from "../pages/admin/unidades/utils/filtrarUnidades";


// Helpers
function formatearFecha(fechaIso) {
  if (!fechaIso) return "—";
  return new Date(fechaIso).toLocaleDateString("es-AR");
}


// Mapeos
const ESTADO_BACK_A_FRONT = {
  OCUPADA: "Ocupada",
  VACIA: "Desocupada",
  EN_REFACCION: "En refacción",
};

const ESTADO_FRONT_A_BACK = {
  Ocupada: "OCUPADA",
  Desocupada: "VACIA",
  "En refacción": "EN_REFACCION",
};

const ROL_BACK_A_FRONT = {
  PROPIETARIO: "Propietario",
  INQUILINO: "Inquilino",
};


// Adaptador
function adaptarUnidad(unidadBack, incidenciasDelEdificio = []) {
  const relaciones = unidadBack.unidadRelaciones || [];

  const usuarios = relaciones.map((rel) => {
	const ocupante = rel.ocupanteId;
	const nombre = ocupante
  	? `${ocupante.nombre || ""} ${ocupante.apellido || ""}`.trim()
  	: "—";

	return {
  	id: rel._id,
  	_id: rel._id,
  	ocupanteId: ocupante?._id || ocupante,
  	nombre,
  	email: ocupante?.email || "",
  	rol: ROL_BACK_A_FRONT[rel.rolEnUnidad] || rel.rolEnUnidad,
  	rolBack: rel.rolEnUnidad,
  	desde: formatearFecha(rel.desde),
  	hasta: rel.hasta ? formatearFecha(rel.hasta) : "—",
  	estadoRelacion:
    	rel.estado === "FINALIZADA" ? "Finalizada" : "Vigente",
  	esOcupanteActual: rel.esOcupanteActual,
	};
  });

  const usuariosVigentes = usuarios.filter(
	(u) => u.estadoRelacion === "Vigente"
  );

  const relacionOcupanteActual = relaciones.find(
	(r) => r.esOcupanteActual === true && r.estado === "VIGENTE"
  );

  const relacionPropietario = relaciones.find(
	(r) =>
  	r.rolEnUnidad === "PROPIETARIO" && r.estado === "VIGENTE"
  );

  const nombreOcupanteActual = relacionOcupanteActual?.ocupanteId
	? `${relacionOcupanteActual.ocupanteId.nombre || ""} ${
    	relacionOcupanteActual.ocupanteId.apellido || ""
  	}`.trim()
	: "—";

  const nombrePropietario = relacionPropietario?.ocupanteId
	? `${relacionPropietario.ocupanteId.nombre || ""} ${
    	relacionPropietario.ocupanteId.apellido || ""
  	}`.trim()
	: "—";

  const historialOcupacion = relaciones
	.filter((r) => r.estado === "FINALIZADA")
	.map((rel) => {
  	const ocupante = rel.ocupanteId;
  	const nombre = ocupante
    	? `${ocupante.nombre || ""} ${ocupante.apellido || ""}`.trim()
    	: "—";

  	return {
    	id: rel._id,
    	ocupante: nombre,
    	rol:
      	ROL_BACK_A_FRONT[rel.rolEnUnidad] || rel.rolEnUnidad,
    	desde: formatearFecha(rel.desde),
    	hasta: formatearFecha(rel.hasta),
    	estado: "Finalizado",
  	};
	});

  const numeroNorm = String(unidadBack.numero || "")
	.toLowerCase()
	.trim();

  const incidenciasDeUnidad = incidenciasDelEdificio
	.filter((inc) => {
  	const espacio = String(inc.espacio || "")
    	.toLowerCase()
    	.trim();
  	return espacio && espacio.includes(numeroNorm);
	})
	.map((inc) => ({
  	id: inc._id,
  	titulo: inc.titulo,
  	fecha: inc.createdAt
    	? new Date(inc.createdAt).toLocaleDateString("es-AR")
    	: "",
  	estado:
    	inc.estado === "ABIERTA"
      	? "Abierta"
      	: inc.estado === "RESUELTA"
      	? "Resuelta"
      	: inc.estado === "CERRADA"
      	? "Cerrada"
      	: inc.estado,
	}));

  return {
	id: unidadBack._id,
	_id: unidadBack._id,
	numero: unidadBack.numero,
	piso: unidadBack.piso,
	edificio: unidadBack.edificioId?.nombre || "—",
	edificioId: unidadBack.edificioId?._id || null,
	estado:
  	ESTADO_BACK_A_FRONT[unidadBack.estado] ||
  	unidadBack.estado,
	estadoBack: unidadBack.estado,
	ocupanteActual: nombreOcupanteActual,
	propietario: nombrePropietario,
	contactosEmergencia:
  	unidadBack.contactosEmergencia || [],
	usuarios: usuariosVigentes,
	historialOcupacion,
	incidencias: incidenciasDeUnidad,
	totalIncidencias: incidenciasDeUnidad.length,
	_raw: unidadBack,
  };
}


// Hook principal
export function useUnidadesAdmin() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const [unidadSeleccionada, setUnidadSeleccionada] =
	useState(null);
  const [unidadEnEdicion, setUnidadEnEdicion] =
	useState(null);

  const [isSuccessOpen, setIsSuccessOpen] =
	useState(false);
  const [successMessage, setSuccessMessage] =
	useState("Cambios guardados con éxito");

  const cargarUnidades = async () => {
	try {
  	setLoading(true);
  	setError("");

  	const [unidadesData, incidenciasData] =
    	await Promise.all([
      	getUnidades(),
      	getIncidencias(),
    	]);

  	const adaptadas = unidadesData.map((u) =>
    	adaptarUnidad(u, incidenciasData)
  	);

  	setUnidades(adaptadas);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar las unidades";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  useEffect(() => {
	cargarUnidades();
  }, []);

  const unidadesFiltradas = useMemo(() => {
	return filtrarUnidades(unidades, {
  	estadoFiltro,
  	busqueda,
	});
  }, [unidades, estadoFiltro, busqueda]);


  // ===== Acciones =====

  const abrirDetalleUnidad = (unidad) => {
	setUnidadSeleccionada(unidad);
	setUnidadEnEdicion(null);
  };

  const abrirEdicionUnidad = (unidad) => {
	setUnidadEnEdicion(clonarDato(unidad));
	setUnidadSeleccionada(null);
  };

  const cerrarVistaUnidad = () => {
	setUnidadSeleccionada(null);
	setUnidadEnEdicion(null);
  };

  const cerrarModalExito = () => {
	setIsSuccessOpen(false);
  };

  const actualizarCampoUnidad = (campo, valor) => {
	setUnidadEnEdicion((prev) => ({
  	...prev,
  	[campo]: valor,
	}));
  };

  const actualizarRelacionUsuario = (
	usuarioId,
	campo,
	valor
  ) => {
	setUnidadEnEdicion((prev) => ({
  	...prev,
  	usuarios: (prev?.usuarios || []).map((u) =>
    	u.id === usuarioId
      	? { ...u, [campo]: valor }
      	: u
  	),
	}));
  };

  const finalizarRelacionUsuario = async (
	usuarioId
  ) => {
	if (!unidadEnEdicion) return;

	const confirmar = window.confirm(
  	"¿Finalizar esta relación? El ocupante quedará desvinculado de la unidad."
	);
	if (!confirmar) return;

	try {
  	await desvincularOcupante(
    	unidadEnEdicion.id,
    	usuarioId
  	);

  	await cargarUnidades();

  	const idEditada = unidadEnEdicion.id;

  	setTimeout(() => {
    	setUnidades((current) => {
      	const actualizada = current.find(
        	(u) => u.id === idEditada
      	);
      	if (actualizada) {
        	setUnidadEnEdicion(
          	clonarDato(actualizada)
        	);
      	}
      	return current;
    	});
  	}, 0);

  	setSuccessMessage(
    	"Relación finalizada con éxito"
  	);
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo finalizar la relación";
  	alert(msg);
	}
  };

  const guardarCambiosUnidad = async () => {
	if (!unidadEnEdicion) return;

	try {
  	const payload = {};

  	const estadoBack =
    	ESTADO_FRONT_A_BACK[unidadEnEdicion.estado];

  	if (
    	estadoBack &&
    	estadoBack !== unidadEnEdicion.estadoBack
  	) {
    	payload.estado = estadoBack;
  	}

  	if (Object.keys(payload).length > 0) {
    	await updateUnidad(
      	unidadEnEdicion.id,
      	payload
    	);
    	await cargarUnidades();
  	}

  	const idEditada = unidadEnEdicion.id;

  	setUnidadEnEdicion(null);

  	setTimeout(() => {
    	setUnidades((current) => {
      	const actualizada = current.find(
        	(u) => u.id === idEditada
      	);
      	if (actualizada) {
        	setUnidadSeleccionada(actualizada);
      	}
      	return current;
    	});
  	}, 0);

  	setSuccessMessage(
    	"Cambios guardados con éxito"
  	);
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo guardar la unidad";
  	alert(msg);
	}
  };

  return {
	estadoFiltro,
	setEstadoFiltro,
	busqueda,
	setBusqueda,
	unidadesFiltradas,
	totalUnidades: unidades.length,
	loading,
	error,
	unidadSeleccionada,
	unidadEnEdicion,
	isSuccessOpen,
	successMessage,
	abrirDetalleUnidad,
	abrirEdicionUnidad,
	cerrarVistaUnidad,
	cerrarModalExito,
	actualizarCampoUnidad,
	actualizarRelacionUsuario,
	finalizarRelacionUsuario,
	guardarCambiosUnidad,
  };
}