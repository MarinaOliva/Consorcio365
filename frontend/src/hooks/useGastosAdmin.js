import { useEffect, useMemo, useState } from "react";

import {
  getGastos,
  createGastoManual,
} from "../services/gastosService";

import { getEdificios } from "../services/edificiosService";

// Mapeos de etiquetas visuales
const ETIQUETA_TIPO = {
  CORRECTIVO: "Reactivo",
  PREVENTIVO: "Preventivo",
  MANUAL: "Manual",
};

const MESES_DEL_ANIO = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

// Adaptador
function adaptarGastoDelBack(g) {
  const trabajo = g.trabajoId;
  const proveedor = trabajo?.proveedorId;
  const incidencia = trabajo?.incidenciaId;
  const instancia = trabajo?.instanciaMantenimientoId;

  let origen = "Manual";
  if (incidencia?._id || incidencia) {
	const incId = incidencia?._id || incidencia;
	origen = `Incidencia #${String(incId).slice(-4)}`;
  } else if (instancia?._id || instancia) {
	const instId = instancia?._id || instancia;
	origen = `Mantenimiento #${String(instId).slice(-4)}`;
  }

  let proveedorNombre = "Carga manual";
  if (proveedor) {
	proveedorNombre = `${proveedor.nombre || ""} ${proveedor.apellido || ""}`.trim();
  }

  const fechaIso = g.fecha;
  const fechaStr = fechaIso
	? new Date(fechaIso).toLocaleDateString("es-AR")
	: "";

  return {
	id: g._id,
	_id: g._id,
	fecha: fechaStr,
	fechaIso,
	concepto: g.concepto || "—",
	tipo: ETIQUETA_TIPO[g.tipo] || g.tipo,
	tipoBack: g.tipo,
	proveedor: proveedorNombre,
	monto: g.monto || 0,
	origen,
	comprobante: g.comprobante || null,
  };
}

// Hook
export function useGastosAdmin() {
  const [gastos, setGastos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [mesFiltro, setMesFiltro] = useState("Todos");

  const [isCargarGastoManualOpen, setIsCargarGastoManualOpen] = useState(false);
  const [isGastoCreadoOpen, setIsGastoCreadoOpen] = useState(false);


  // Carga inicial

  const cargarGastos = async () => {
	try {
  	setLoading(true);
  	setError("");

  	const [gastosData, edificiosData] = await Promise.all([
    	getGastos(),
    	getEdificios(),
  	]);

  	const adaptados = gastosData.map(adaptarGastoDelBack);
  	setGastos(adaptados);
  	setEdificios(edificiosData || []);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar los gastos";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  useEffect(() => {
	cargarGastos();
  }, []);


  // Filtros locales

  const gastosFiltrados = useMemo(() => {
	return gastos.filter((gasto) => {
  	const coincideTipo =
    	tipoFiltro === "Todos" ||
    	normalizarTexto(gasto.tipo) === normalizarTexto(tipoFiltro);

  	const nombreMesGasto = gasto.fechaIso
    	? new Date(gasto.fechaIso).toLocaleDateString("es-AR", { month: "long" })
    	: "";
  	const nombreMesGastoCapitalizado =
    	nombreMesGasto.charAt(0).toUpperCase() + nombreMesGasto.slice(1);

  	const coincideMes =
    	mesFiltro === "Todos" || nombreMesGastoCapitalizado === mesFiltro;

  	return coincideTipo && coincideMes;
	});
  }, [gastos, tipoFiltro, mesFiltro]);


  // Resumen

  const resumen = useMemo(() => {
	const total = gastosFiltrados.reduce((acc, g) => acc + g.monto, 0);

	const reactivos = gastosFiltrados
  	.filter((g) => g.tipoBack === "CORRECTIVO")
  	.reduce((acc, g) => acc + g.monto, 0);

	const preventivos = gastosFiltrados
  	.filter((g) => g.tipoBack === "PREVENTIVO")
  	.reduce((acc, g) => acc + g.monto, 0);

	const manuales = gastosFiltrados
  	.filter((g) => g.tipoBack === "MANUAL")
  	.reduce((acc, g) => acc + g.monto, 0);

	const porcentaje = (v) => (total ? Math.round((v / total) * 100) : 0);

	return {
  	total,
  	reactivos,
  	preventivos,
  	manuales,
  	porcentajeReactivos: porcentaje(reactivos),
  	porcentajePreventivos: porcentaje(preventivos),
  	porcentajeManuales: porcentaje(manuales),
	};
  }, [gastosFiltrados]);


  // Modal carga manual

  const abrirModalCargarGastoManual = () => {
	setIsCargarGastoManualOpen(true);
  };

  const cerrarModalCargarGastoManual = () => {
	setIsCargarGastoManualOpen(false);
  };

  const guardarGastoManual = async (datos) => {
	const edificioId = edificios[0]?._id;
	if (!edificioId) {
  	alert("No hay edificio disponible para asociar el gasto.");
  	return;
	}

	try {
  	const formData = new FormData();
  	formData.append("edificioId", edificioId);
  	formData.append("concepto", datos.concepto);
  	formData.append("monto", datos.monto);
  	if (datos.comprobante) {
    	formData.append("comprobante", datos.comprobante);
  	}

  	await createGastoManual(formData);

  	setIsCargarGastoManualOpen(false);
  	setIsGastoCreadoOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cargar el gasto";
  	alert(msg);
	}
  };

  const cerrarGastoCreado = async () => {
	setIsGastoCreadoOpen(false);
	await cargarGastos();
  };

  return {
	gastos,
	gastosFiltrados,
	loading,
	error,
	resumen,

	tipoFiltro,
	setTipoFiltro,
	mesFiltro,
	setMesFiltro,
	MESES_DEL_ANIO,

	isCargarGastoManualOpen,
	abrirModalCargarGastoManual,
	cerrarModalCargarGastoManual,
	guardarGastoManual,

	isGastoCreadoOpen,
	cerrarGastoCreado,
  };
}

