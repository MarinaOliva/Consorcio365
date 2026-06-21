import { useEffect, useMemo, useState } from "react";
import {
  getPlanes,
  getInstancias,
  createPlan as createPlanService,
} from "../services/mantenimientoService";
import { getEdificios } from "../services/edificiosService";
import { mostrarToastError } from "../utils/toasts";

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

export function obtenerEtiquetaEstadoPlan(plan) {
  if (!plan?.activo) return "Inactivo";
  return "Activo";
}

export function obtenerEtiquetaEstadoInstancia(instancia, plan) {
  // Si el plan está inactivo, no mostramos estado de instancia
  if (plan && !plan.activo) return "---";
  if (!instancia) return "---";
  if (instancia.estado === "PROGRAMADA") return "Programado";
  if (instancia.estado === "EN_CURSO") return "En curso";
  if (instancia.estado === "CERRADA") return "Completada";
  return "---";
}

export function obtenerInstanciaProgramada(instancia, plan) {
  // Si el plan está inactivo, no mostramos fecha
  if (plan && !plan.activo) return "---";
  if (!instancia?.fechaProgramada) return "A programar";
  return new Date(instancia.fechaProgramada).toLocaleDateString("es-AR");
}

export function useMantenimiento() {
  const [planes, setPlanes] = useState([]);
  const [instanciasActivas, setInstanciasActivas] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroEstadoPlan, setFiltroEstadoPlan] = useState("Todos");
  const [filtroEstadoInstancia, setFiltroEstadoInstancia] = useState("Todos");

  const [modalNuevoPlanAbierto, setModalNuevoPlanAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

  // Carga inicial: planes + instancias activas + edificios en paralelo
  useEffect(() => {
	let activo = true;

	async function cargarDatos() {
  	try {
    	const [planesData, edificiosData, programadas, enCurso] =
      	await Promise.all([
        	getPlanes(),
        	getEdificios(),
        	getInstancias({ estado: "PROGRAMADA" }),
        	getInstancias({ estado: "EN_CURSO" }),
      	]);

    	if (!activo) return;
    	setPlanes(planesData);
    	setEdificios(edificiosData);
    	setInstanciasActivas([...programadas, ...enCurso]);
  	} catch (err) {
    	if (!activo) return;
    	const msg =
      	err?.response?.data?.message ||
      	err?.message ||
      	"No se pudieron cargar los planes de mantenimiento";
    	setError(msg);
  	} finally {
    	if (activo) setLoading(false);
  	}
	}

	cargarDatos();

	return () => {
  	activo = false;
	};
  }, []);

  // Indexamos instancias activas por planId para búsqueda rápida
  // Si un plan tiene varias, prioridad: EN_CURSO > PROGRAMADA con fecha más cercana
  const instanciasPorPlanId = useMemo(() => {
	const indice = {};
	instanciasActivas.forEach((inst) => {
  	const planId = inst.planId?._id || inst.planId;
  	if (!planId) return;

  	const existente = indice[planId];

  	if (!existente) {
    	indice[planId] = inst;
    	return;
  	}

  	if (inst.estado === "EN_CURSO" && existente.estado !== "EN_CURSO") {
    	indice[planId] = inst;
    	return;
  	}
  	if (existente.estado === "EN_CURSO") return;

  	const fechaInst = new Date(inst.fechaProgramada).getTime();
  	const fechaExistente = new Date(existente.fechaProgramada).getTime();
  	if (fechaInst < fechaExistente) {
    	indice[planId] = inst;
  	}
	});
	return indice;
  }, [instanciasActivas]);

  // Adaptamos planes con info de su instancia próxima
  const planesAdaptados = useMemo(() => {
	return planes.map((plan) => {
  	const proximaInstancia = instanciasPorPlanId[plan._id] || null;

  	return {
    	...plan,
    	id: plan._id,
    	proximaInstancia,
    	estadoPlan: obtenerEtiquetaEstadoPlan(plan),
    	estadoInstancia: obtenerEtiquetaEstadoInstancia(proximaInstancia, plan),
    	instanciaProgramada: obtenerInstanciaProgramada(proximaInstancia, plan),
  	};
	});
  }, [planes, instanciasPorPlanId]);

  // Filtrado por estado del plan + estado de la instancia
  const planesFiltrados = useMemo(() => {
	return planesAdaptados.filter((plan) => {
  	const estadoPlan = normalizarTexto(plan.estadoPlan);
  	const estadoInstancia = normalizarTexto(plan.estadoInstancia);

  	if (filtroEstadoPlan !== "Todos") {
    	if (normalizarTexto(filtroEstadoPlan) !== estadoPlan) return false;
  	}

  	if (filtroEstadoInstancia !== "Todos") {
    	if (normalizarTexto(filtroEstadoInstancia) !== estadoInstancia)
      	return false;
  	}

  	return true;
	});
  }, [planesAdaptados, filtroEstadoPlan, filtroEstadoInstancia]);

  // Modal de creación
  const abrirModalNuevoPlan = () => setModalNuevoPlanAbierto(true);
  const cerrarModalNuevoPlan = () => setModalNuevoPlanAbierto(false);

  const manejarCrearPlan = async (datosFormulario) => {
	const edificioId = edificios[0]?._id;
	if (!edificioId) {
  	mostrarToastError("No hay edificios disponibles");
  	return;
	}

	const payload = {
  	edificioId,
  	tarea: datosFormulario.tarea.trim(),
  	especialidad: datosFormulario.especialidad,
  	frecuencia: datosFormulario.frecuencia.toLowerCase(),
	};

	try {
  	const planCreado = await createPlanService(payload);
  	setPlanes((prev) => [planCreado, ...prev]);
  	setModalNuevoPlanAbierto(false);
  	setModalExitoAbierto(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo crear el plan";
  	 mostrarToastError(msg);
	}
  };

  const cerrarModalExito = () => setModalExitoAbierto(false);

  return {
	planes: planesAdaptados,
	planesFiltrados,
	loading,
	error,

	filtroEstadoPlan,
	setFiltroEstadoPlan,
	filtroEstadoInstancia,
	setFiltroEstadoInstancia,

	modalNuevoPlanAbierto,
	abrirModalNuevoPlan,
	cerrarModalNuevoPlan,
	manejarCrearPlan,

	modalExitoAbierto,
	cerrarModalExito,
  };
}

