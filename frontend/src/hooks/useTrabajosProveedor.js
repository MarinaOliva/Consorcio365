import { useEffect, useMemo, useState } from "react";

import {
  getTrabajos,
  cambiarEstadoTrabajo,
  subirEvidencias,
} from "../services/trabajosService";

import { useAuth } from "./useAuth";

// Mapeo back → etiqueta visual
const ESTADO_BACK_A_FRONT = {
  CREADO: "Creado",
  ASIGNADO: "Asignado",
  EN_EJECUCION: "En progreso",
  FINALIZADO: "Finalizado",
  CERRADO: "Cerrado",
  CANCELADO: "Cancelado",
};

function formatearFecha(fechaIso) {
  if (!fechaIso) return "—";
  return new Date(fechaIso).toLocaleDateString("es-AR");
}

function formatearMonto(valor) {
  return Number(valor) || 0;
}

// Adaptador
function adaptarTrabajo(trabajoBack) {
  const incidencia = trabajoBack.incidenciaId;
  const instancia = trabajoBack.instanciaMantenimientoId;

  const tituloMostrado =
	incidencia?.titulo || trabajoBack.descripcion || "Trabajo de mantenimiento";

  // Edificio
  const edificio =
	incidencia?.edificioId?.nombre ||
	instancia?.planId?.edificioId?.nombre ||
	"—";

  const unidad = incidencia?.espacio || "—";

  // Buscar fecha de asignación en el historial
  const itemAsignado = trabajoBack.historialEstados?.find(
	(h) => h.estadoNuevo === "ASIGNADO"
  );
  const itemEnEjecucion = trabajoBack.historialEstados?.find(
	(h) => h.estadoNuevo === "EN_EJECUCION"
  );
  const itemFinalizado = trabajoBack.historialEstados?.find(
	(h) => h.estadoNuevo === "FINALIZADO"
  );

  return {
	id: trabajoBack._id,
	_id: trabajoBack._id,
	titulo: tituloMostrado,
	descripcion: trabajoBack.descripcion || "",
	estado: ESTADO_BACK_A_FRONT[trabajoBack.estado] || trabajoBack.estado,
	estadoBack: trabajoBack.estado,
	edificio,
	unidad,
	ubicacion: incidencia?.espacio || `${edificio}${unidad !== "—" ? " - " + unidad : ""}`,
	monto: formatearMonto(trabajoBack.monto),
	presupuesto: formatearMonto(trabajoBack.monto),
	fechaAsignacion: formatearFecha(itemAsignado?.fecha || trabajoBack.createdAt),
	fechaInicio: itemEnEjecucion ? formatearFecha(itemEnEjecucion.fecha) : "—",
	fechaFinalizacion: itemFinalizado ? formatearFecha(itemFinalizado.fecha) : "—",
	fecha: formatearFecha(trabajoBack.createdAt),
	evidencias: trabajoBack.evidencias || [],
	incidencia: incidencia?.titulo || null,
	_raw: trabajoBack,
  };
}

// Hook
export function useTrabajosProveedor() {
  const { user } = useAuth();

  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modales
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [trabajoEnFinalizacion, setTrabajoEnFinalizacion] = useState(null);
  const [trabajoEnCargaEvidencia, setTrabajoEnCargaEvidencia] = useState(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Carga
  const cargarTrabajos = async () => {
	try {
  	setLoading(true);
  	setError("");

  	// El back filtra automáticamente por proveedor
  	const data = await getTrabajos();
  	const adaptados = data.map(adaptarTrabajo);
  	setTrabajos(adaptados);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar los trabajos";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  useEffect(() => {
	cargarTrabajos();
  }, []);

  // Especialidad del proveedor
  const especialidad = useMemo(() => {
	return (
  	user?.proveedorDetalle?.especialidad ||
  	user?.especialidad ||
  	"Sin especialidad"
	);
  }, [user]);

  // Trabajos activos (ASIGNADO + EN_EJECUCION)
  const trabajosActivos = useMemo(() => {
	return trabajos.filter((t) => {
  	const estado = t.estadoBack;
  	return estado === "ASIGNADO" || estado === "EN_EJECUCION";
	});
  }, [trabajos]);

  // Historial (FINALIZADO + CERRADO)
  const trabajosHistoricos = useMemo(() => {
	return trabajos.filter((t) => {
  	const estado = t.estadoBack;
  	return estado === "FINALIZADO" || estado === "CERRADO";
	});
  }, [trabajos]);

  // Estadísticas
  const estadisticas = useMemo(() => {
	const pendientes = trabajos.filter((t) => t.estadoBack === "ASIGNADO").length;
	const enCurso = trabajos.filter((t) => t.estadoBack === "EN_EJECUCION").length;
	const finalizados = trabajos.filter(
  	(t) => t.estadoBack === "FINALIZADO" || t.estadoBack === "CERRADO"
	).length;

	return { pendientes, enCurso, finalizados };
  }, [trabajos]);

  // Acciones
  const handleVerDetalleTrabajo = (trabajo) => {
	setTrabajoSeleccionado(trabajo);
  };

  const handleCerrarDetalleTrabajo = () => {
	setTrabajoSeleccionado(null);
  };

  // ASIGNADO → EN_EJECUCION
  const handleMarcarEnProgreso = async (trabajo) => {
	try {
  	await cambiarEstadoTrabajo(trabajo.id, {
    	estadoNuevo: "EN_EJECUCION",
  	});
  	await cargarTrabajos();
  	setTrabajoSeleccionado(null);
  	setSuccessMessage("Trabajo marcado como en progreso");
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo iniciar el trabajo";
  	alert(msg);
	}
  };

  // Confirmación finalización
  const handleAbrirConfirmacionFinalizacion = (trabajo) => {
	setTrabajoSeleccionado(null);
	setTrabajoEnFinalizacion(trabajo);
  };

  const handleCerrarConfirmacionFinalizacion = () => {
	setTrabajoEnFinalizacion(null);
  };

  // EN_EJECUCION → FINALIZADO
  const handleConfirmarFinalizacionTrabajo = async () => {
	if (!trabajoEnFinalizacion) return;

	try {
  	await cambiarEstadoTrabajo(trabajoEnFinalizacion.id, {
    	estadoNuevo: "FINALIZADO",
  	});
  	await cargarTrabajos();
  	setTrabajoEnFinalizacion(null);
  	setSuccessMessage("Trabajo finalizado correctamente");
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo finalizar el trabajo";
  	alert(msg);
	}
  };

  // Subir evidencias
  const handleAbrirSubirEvidencias = (trabajo) => {
	setTrabajoSeleccionado(null);
	setTrabajoEnCargaEvidencia(trabajo);
  };

  const handleCerrarSubirEvidencias = () => {
	setTrabajoEnCargaEvidencia(null);
  };

  const handleSubirEvidencias = async (archivos) => {
	if (!trabajoEnCargaEvidencia || !archivos?.length) return;

	try {
  	const formData = new FormData();
  	archivos.forEach((archivo) => {
    	formData.append("evidencias", archivo);
  	});

  	await subirEvidencias(trabajoEnCargaEvidencia.id, formData);
  	await cargarTrabajos();

  	setTrabajoEnCargaEvidencia(null);
  	setSuccessMessage("Evidencias subidas con éxito");
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron subir las evidencias";
  	alert(msg);
	}
  };

  const cerrarSuccess = () => {
	setIsSuccessOpen(false);
	setSuccessMessage("");
  };

  return {
	// Datos
	trabajos,
	trabajosActivos,
	trabajosHistoricos,
	estadisticas,
	especialidad,
	loading,
	error,

	// Selección
	trabajoSeleccionado,
	trabajoEnFinalizacion,
	trabajoEnCargaEvidencia,

	// Modales success
	isSuccessOpen,
	successMessage,

	// Acciones
	handleVerDetalleTrabajo,
	handleCerrarDetalleTrabajo,
	handleMarcarEnProgreso,
	handleAbrirConfirmacionFinalizacion,
	handleCerrarConfirmacionFinalizacion,
	handleConfirmarFinalizacionTrabajo,
	handleAbrirSubirEvidencias,
	handleCerrarSubirEvidencias,
	handleSubirEvidencias,
	cerrarSuccess,
  };
}

