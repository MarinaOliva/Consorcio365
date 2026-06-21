import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mostrarToastError } from "../utils/toasts";
import {
  getPlan,
  createInstancia,
  cambiarEstadoInstancia,
  updatePlan,
} from "../services/mantenimientoService";

import { getTrabajos, createTrabajo } from "../services/trabajosService";
import { getUsuarios } from "../services/usersService";

import { determinarCasoDetallePlan } from "../pages/admin/mantenimiento/utils/determinarCasoDetallePlan";

// Helpers
function obtenerEstadoPlanVisual(plan) {
  if (!plan) return "";
  return plan.activo ? "Activo" : "Inactivo";
}

function obtenerEstadoInstanciaVisual(instancia) {
  if (!instancia) return "---";
  if (instancia.estado === "PROGRAMADA") return "Programado";
  if (instancia.estado === "EN_CURSO") return "En curso";
  if (instancia.estado === "CERRADA") return "Completada";
  return "---";
}

function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return null;
  return new Date(fechaIso).toLocaleDateString("es-AR");
}

// Hook
export function usePlanDetalle(planId) {
  const navigate = useNavigate();

  const [planRaw, setPlanRaw] = useState(null);
  const [proximaFechaSugerida, setProximaFechaSugerida] = useState(null);
  const [instanciasConTrabajo, setInstanciasConTrabajo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modales
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [modalExitoActivacionAbierto, setModalExitoActivacionAbierto] = useState(false);
  const [modalCerrarInstanciaAbierto, setModalCerrarInstanciaAbierto] = useState(false);
  const [modalExitoCerrarAbierto, setModalExitoCerrarAbierto] = useState(false);
  const [modalInstanciaCreadaAbierto, setModalInstanciaCreadaAbierto] = useState(false);

  // Calendario
  const [fechaInstancia, setFechaInstancia] = useState("");

  // Crear trabajo desde plan
  const [proveedoresActivos, setProveedoresActivos] = useState([]);
  const [modalCrearTrabajoAbierto, setModalCrearTrabajoAbierto] = useState(false);
  const [modalTrabajoCreadoAbierto, setModalTrabajoCreadoAbierto] = useState(false);
  const [trabajoDraft, setTrabajoDraft] = useState({
	descripcion: "",
	proveedorId: "",
	monto: 0,
  });


  // Cargar plan + instancias + trabajos asociados

  const cargarDetalle = async () => {
	try {
  	setLoading(true);
  	setError("");

  	const { plan, proximaFechaSugerida, ultimasInstancias } = await getPlan(planId);

  	const trabajos = await getTrabajos();

  	const instancias = (ultimasInstancias || []).map((inst) => {
    	const trabajo = trabajos.find(
      	(t) =>
        	(t.instanciaMantenimientoId?._id || t.instanciaMantenimientoId) === inst._id
    	);

    	return {
      	...inst,
      	trabajo: trabajo || null,
    	};
  	});

  	setPlanRaw(plan);
  	setProximaFechaSugerida(proximaFechaSugerida);
  	setInstanciasConTrabajo(instancias);

  	const activa = instancias.find(
    	(i) => i.estado === "PROGRAMADA" || i.estado === "EN_CURSO"
  	);
  	if (proximaFechaSugerida && !activa) {
    	const fechaIso = new Date(proximaFechaSugerida).toISOString().split("T")[0];
    	setFechaInstancia(fechaIso);
  	}
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cargar el plan";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  const cargarProveedores = async () => {
	try {
  	const data = await getUsuarios({ tipo: "proveedor", estado: "ACTIVO" });
  	setProveedoresActivos(data || []);
	} catch (err) {
  	console.warn("No se pudieron cargar los proveedores:", err);
	}
  };

  useEffect(() => {
	if (!planId) return;
	cargarDetalle();
	cargarProveedores();
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);


  // Instancia activa

  const instanciaActual = useMemo(
	() =>
  	instanciasConTrabajo.find(
    	(i) => i.estado === "PROGRAMADA" || i.estado === "EN_CURSO"
  	) || null,
	[instanciasConTrabajo]
  );


  // Última instancia cerrada

  const ultimaInstanciaCerrada = useMemo(() => {
	const cerradas = instanciasConTrabajo
  	.filter((i) => i.estado === "CERRADA")
  	.sort((a, b) => new Date(b.fechaProgramada) - new Date(a.fechaProgramada));

	if (cerradas.length === 0) return null;

	const ultima = cerradas[0];
	const trabajo = ultima.trabajo;
	const proveedor = trabajo?.proveedorId;

	return {
  	proveedor: proveedor
    	? `${proveedor.nombre || ""} ${proveedor.apellido || ""}`.trim()
    	: "—",
  	especialidad: proveedor?.proveedorDetalle?.especialidad || "—",
  	monto: trabajo?.monto || 0,
  	fecha: formatearFechaCorta(ultima.fechaProgramada) || "—",
  	comprobanteUrl: null,
	};
  }, [instanciasConTrabajo]);


  // Plan adaptado

  const planAdaptado = useMemo(() => {
	if (!planRaw) return null;

	return {
  	...planRaw,
  	id: planRaw._id,

  	estadoPlan: obtenerEstadoPlanVisual(planRaw),
  	estadoInstancia: obtenerEstadoInstanciaVisual(instanciaActual),
  	instanciaProgramada: instanciaActual
    	? formatearFechaCorta(instanciaActual.fechaProgramada)
    	: "A programar",

  	tareaDetalle: planRaw.tarea,
  	edificio: planRaw.edificioId?.nombre || "—",
  	proveedorAsignado: ultimaInstanciaCerrada?.proveedor || "—",

  	ultimaInstancia: ultimaInstanciaCerrada,

  	proximaInstancia: instanciaActual
    	? {
        	fechaProgramada: formatearFechaCorta(instanciaActual.fechaProgramada),
        	fechaProgramadaISO: new Date(instanciaActual.fechaProgramada)
          	.toISOString()
          	.split("T")[0],
        	instanciaId: instanciaActual._id,
        	estado: instanciaActual.estado,
        	trabajoAsociadoId: instanciaActual.trabajo?._id || null,
      	}
    	: proximaFechaSugerida
    	? {
        	fechaSugerida: formatearFechaCorta(proximaFechaSugerida),
      	}
    	: null,

  	historialInstancias: instanciasConTrabajo
    	.sort((a, b) => new Date(b.fechaProgramada) - new Date(a.fechaProgramada))
    	.map((i) => ({
      	fechaProgramada: formatearFechaCorta(i.fechaProgramada),
      	monto: i.trabajo?.monto || 0,
      	estado: obtenerEstadoInstanciaVisual(i),
    	})),
	};
  }, [planRaw, instanciaActual, ultimaInstanciaCerrada, instanciasConTrabajo, proximaFechaSugerida]);


  // Instancia preseleccionada para el modal de crear trabajo

  const instanciaPreseleccionada = useMemo(() => {
	if (!instanciaActual || !planRaw) return null;
	return {
  	_id: instanciaActual._id,
  	tarea: planRaw.tarea,
  	especialidad: planRaw.especialidad,
  	edificio: planRaw.edificioId?.nombre || "—",
  	fechaProgramada: formatearFechaCorta(instanciaActual.fechaProgramada),
	};
  }, [instanciaActual, planRaw]);


  // Caso

  const casoDetalle = useMemo(() => {
	if (!planAdaptado) return null;
	return determinarCasoDetallePlan(planAdaptado);
  }, [planAdaptado]);


  // Acciones

  const volverAListado = () => navigate("/admin/mantenimiento");

  // Activar plan
  const abrirConfirmacionActivacion = () => setModalConfirmacionAbierto(true);
  const cerrarConfirmacionActivacion = () => setModalConfirmacionAbierto(false);

  const confirmarActivacionPlan = async () => {
	try {
  	await updatePlan(planId, { activo: true });
  	setModalConfirmacionAbierto(false);
  	setModalExitoActivacionAbierto(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo activar el plan";
  	 mostrarToastError(msg);
	}
  };

  const cerrarModalExitoActivacion = () => {
	setModalExitoActivacionAbierto(false);
	cargarDetalle();
  };

  // Crear instancia
  const handleCrearInstancia = async () => {
	if (!fechaInstancia) return;
	try {
  	await createInstancia({ planId, fechaProgramada: fechaInstancia });
  	setModalInstanciaCreadaAbierto(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo crear la instancia";
  	 mostrarToastError(msg);
	}
  };

  const cerrarModalInstanciaCreada = () => {
	setModalInstanciaCreadaAbierto(false);
	cargarDetalle();
  };

  // Cerrar instancia
  const abrirModalCerrarInstancia = () => setModalCerrarInstanciaAbierto(true);
  const cerrarModalCerrarInstancia = () => setModalCerrarInstanciaAbierto(false);

  const confirmarCerrarInstancia = async () => {
	if (!instanciaActual) return;
	try {
  	await cambiarEstadoInstancia(instanciaActual._id, "CERRADA");
  	setModalCerrarInstanciaAbierto(false);
  	setModalExitoCerrarAbierto(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cerrar la instancia";
		mostrarToastError(msg);
	}
  };

  const cerrarModalExitoCerrar = () => {
	setModalExitoCerrarAbierto(false);
	cargarDetalle();
  };

  // Ver trabajo
  const handleVerTrabajoAsociado = () => {
	const trabajoId = instanciaActual?.trabajo?._id;
	if (trabajoId) {
  	navigate(`/admin/trabajos?detalle=${trabajoId}`);
	} else if (instanciaActual?._id) {
  	navigate(`/admin/trabajos?instanciaMantenimientoId=${instanciaActual._id}`);
	}
  };

  // Crear trabajo desde plan
  const abrirModalCrearTrabajo = () => {
	setTrabajoDraft({
  	descripcion: "",
  	proveedorId: "",
  	monto: 0,
	});
	setModalCrearTrabajoAbierto(true);
  };

  const cerrarModalCrearTrabajo = () => {
	setModalCrearTrabajoAbierto(false);
  };

  const handleChangeTrabajoDraft = (campo, valor) => {
	setTrabajoDraft((prev) => ({
  	...prev,
  	[campo]: valor,
	}));
  };

  const handleCrearTrabajoDesdePlan = async () => {
	if (!instanciaActual?._id) {
  	mostrarToastError("No hay una instancia activa para asociar al trabajo.");
  	return;
	}
	if (!trabajoDraft.descripcion?.trim()) {
  	mostrarToastError("Ingresá la descripción del trabajo.");
  	return;
	}

	try {
  	const payload = {
    	instanciaMantenimientoId: instanciaActual._id,
    	descripcion: trabajoDraft.descripcion.trim(),
    	monto: Number(trabajoDraft.monto) || 0,
  	};

  	if (trabajoDraft.proveedorId) {
    	payload.proveedorId = trabajoDraft.proveedorId;
  	}

  	await createTrabajo(payload);
  	setModalCrearTrabajoAbierto(false);
  	setModalTrabajoCreadoAbierto(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo crear el trabajo";
		mostrarToastError(msg);
	}
  };

  const cerrarModalTrabajoCreado = () => {
	setModalTrabajoCreadoAbierto(false);
	cargarDetalle();
  };

  return {
	plan: planAdaptado,
	caso: casoDetalle,
	loading,
	error,

	fechaInstancia,
	setFechaInstancia,

	volverAListado,

	// Activación
	modalConfirmacionAbierto,
	abrirConfirmacionActivacion,
	cerrarConfirmacionActivacion,
	confirmarActivacionPlan,
	modalExitoActivacionAbierto,
	cerrarModalExitoActivacion,

	// Crear instancia
	handleCrearInstancia,
	modalInstanciaCreadaAbierto,
	cerrarModalInstanciaCreada,

	// Cerrar instancia
	modalCerrarInstanciaAbierto,
	abrirModalCerrarInstancia,
	cerrarModalCerrarInstancia,
	confirmarCerrarInstancia,
	modalExitoCerrarAbierto,
	cerrarModalExitoCerrar,

	// Ver trabajo
	handleVerTrabajoAsociado,

	// Crear trabajo desde plan
	proveedoresActivos,
	instanciaPreseleccionada,
	modalCrearTrabajoAbierto,
	abrirModalCrearTrabajo,
	cerrarModalCrearTrabajo,
	trabajoDraft,
	handleChangeTrabajoDraft,
	handleCrearTrabajoDesdePlan,
	modalTrabajoCreadoAbierto,
	cerrarModalTrabajoCreado,
  };
}

