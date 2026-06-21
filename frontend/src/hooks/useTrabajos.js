import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {getUsuarios} from "../services/usersService";

import {
  getTrabajos,
  cambiarEstadoTrabajo,
  deleteTrabajo,
  updateTrabajo,
  asignarProveedor,
  createTrabajo,
} from "../services/trabajosService";

import { getIncidencias } from "../services/incidenciasService";

import {
  estaDentroDelRango,
  normalizarTexto,
} from "../pages/admin/trabajos/utils/fechas";

import {
  TRABAJO_DRAFT_INICIAL,
  clonarObjeto,
  obtenerCodigoTrabajo,
} from "../pages/admin/trabajos/utils/trabajos";

// Adaptador
function adaptarTrabajoDelBack(trabajoBack) {
  const incidencia = trabajoBack.incidenciaId;
  const instancia = trabajoBack.instanciaMantenimientoId;
  const proveedor = trabajoBack.proveedorId;

  const tituloMostrado = incidencia?.titulo || trabajoBack.descripcion || "Trabajo de mantenimiento";
  const origen = incidencia ? "Incidencia" : "Mantenimiento";

  return {
	
	id: trabajoBack._id,
	_id: trabajoBack._id,

	incidencia: tituloMostrado,
	numeroIncidencia: incidencia?._id?.slice(-4) || instancia?._id?.slice(-4) || "----",
	origen,

	estado: trabajoBack.estado,

	proveedor: proveedor
  	? `${proveedor.nombre || ""} ${proveedor.apellido || ""}`.trim()
  	: "Sin proveedor asignado",
	proveedorId: proveedor?._id || null,

	presupuesto: trabajoBack.monto || 0,
	fecha: trabajoBack.createdAt
  	? new Date(trabajoBack.createdAt).toLocaleDateString("es-AR")
  	: "",
	fechaISO: trabajoBack.createdAt,

	descripcion: trabajoBack.descripcion || "",

	incidenciaId: incidencia?._id || null,
	instanciaMantenimientoId: instancia?._id || null,

	evidencias: trabajoBack.evidencias || [],

	historialEstados: trabajoBack.historialEstados || [],

	categoria: incidencia?.categoria || "",
	edificio: incidencia?.edificioId?.nombre || "",
	unidad: incidencia?.espacio || "",
	piso: "",

	_raw: trabajoBack,
  };
}

export function useTrabajosAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detalleTrabajoId = searchParams.get("detalle");

  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [proveedorFiltro, setProveedorFiltro] = useState("Todos");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  const [isCrearTrabajoOpen, setIsCrearTrabajoOpen] = useState(false);
  const [isTrabajoSuccessOpen, setIsTrabajoSuccessOpen] = useState(false);

  const [trabajoEnEdicion, setTrabajoEnEdicion] = useState(null);
  const [trabajoEditado, setTrabajoEditado] = useState(null);
  const [isCambiosGuardadosOpen, setIsCambiosGuardadosOpen] = useState(false);

  const DRAFT_INICIAL = {
	incidenciaId: "",
	proveedorId: "",
	descripcion: "",
	monto: 0,
  };
  const [trabajoDraft, setTrabajoDraft] = useState(DRAFT_INICIAL);

  const [isConfirmarEliminacionOpen, setIsConfirmarEliminacionOpen] = useState(false);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [isEliminacionSuccessOpen, setIsEliminacionSuccessOpen] = useState(false);

  const [proveedoresActivos, setProveedoresActivos] = useState([]);
  const [incidenciasActivas, setIncidenciasActivas] = useState([]);

  const cargarTrabajos = async () => {
	try {
  	setLoading(true);
  	setError("");
  	const data = await getTrabajos();
  	const adaptados = data.map(adaptarTrabajoDelBack);
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
	
  const cargarProveedores = async () => {
	try {
  	const data = await getUsuarios({ tipo: "proveedor", estado: "ACTIVO" });
  	setProveedoresActivos(data || []);
	} catch (err) {
  	console.error("Error al cargar proveedores:", err);
	}
  };

 const cargarIncidencias = async () => {
	try {
  	const abiertas = await getIncidencias({ estado: "ABIERTA" });
  	const enProgreso = await getIncidencias({ estado: "EN_PROGRESO" });
  	setIncidenciasActivas([...abiertas, ...enProgreso]);
	} catch (err) {
  	console.error("Error al cargar incidencias activas:", err);
	}
  };

  useEffect(() => {
	cargarTrabajos();
	cargarProveedores();
	cargarIncidencias();
  }, []);


  // Trabajo seleccionado

  const trabajoPorParametro = useMemo(() => {
	if (!detalleTrabajoId) return null;

	return (
  	trabajos.find((item) => String(item.id) === String(detalleTrabajoId)) ||
  	null
	);
  }, [detalleTrabajoId, trabajos]);

  const trabajoSeleccionado = trabajoPorParametro
	? {
    	...trabajoPorParametro,
    	codigoTrabajo: obtenerCodigoTrabajo(trabajoPorParametro),
  	}
	: null;

  // Filtros y búsqueda
 
  const proveedoresDisponibles = useMemo(() => {
	return [...new Set(trabajos.map((t) => t.proveedor))].filter(Boolean);
  }, [trabajos]);

  const trabajosFiltrados = useMemo(() => {
	return trabajos.filter((trabajo) => {
  	const coincideEstado =
    	estadoFiltro === "Todos" || trabajo.estado === estadoFiltro;

  	const coincideProveedor =
    	proveedorFiltro === "Todos" || trabajo.proveedor === proveedorFiltro;

  	const coincideFecha = estaDentroDelRango(trabajo.fecha, fechaFiltro);

  	const textoBusqueda = normalizarTexto(busqueda);
  	const numeroIncidencia = normalizarTexto(trabajo.numeroIncidencia);
  	const numeroIncidenciaConNumeral = normalizarTexto(
    	`#${trabajo.numeroIncidencia}`
  	);

  	const coincideBusqueda =
    	!textoBusqueda ||
    	normalizarTexto(trabajo.incidencia).includes(textoBusqueda) ||
    	normalizarTexto(trabajo.origen).includes(textoBusqueda) ||
    	normalizarTexto(trabajo.estado).includes(textoBusqueda) ||
    	normalizarTexto(trabajo.proveedor).includes(textoBusqueda) ||
    	numeroIncidencia.includes(textoBusqueda.replace("#", "")) ||
    	numeroIncidenciaConNumeral.includes(textoBusqueda);

  	return (
    	coincideEstado &&
    	coincideProveedor &&
    	coincideFecha &&
    	coincideBusqueda
  	);
	});
  }, [trabajos, busqueda, estadoFiltro, proveedorFiltro, fechaFiltro]);

  // Navegación detalle / edición / listado
  const handleVerTrabajo = (trabajo) => {
	setTrabajoEnEdicion(null);
	setTrabajoEditado(null);

	setSearchParams((prev) => {
  	const next = new URLSearchParams(prev);
  	next.set("detalle", trabajo.id);
  	return next;
	});
  };

  const handleVolverListado = () => {
	setTrabajoEnEdicion(null);
	setTrabajoEditado(null);

	setSearchParams((prev) => {
  	const next = new URLSearchParams(prev);
  	next.delete("detalle");
  	return next;
	});
  };

  const handleEditarTrabajo = (trabajo) => {
	setTrabajoEnEdicion(trabajo);
	setTrabajoEditado(clonarObjeto(trabajo));

	setSearchParams((prev) => {
  	const next = new URLSearchParams(prev);
  	next.delete("detalle");
  	return next;
	});
  };

  const handleChangeEstadoTrabajo = (estado) => {
	setTrabajoEditado((prev) => ({
  	...prev,
  	estado,
	}));
  };

  const handleChangeMontoTrabajo = (monto) => {
	setTrabajoEditado((prev) => ({
  	...prev,
  	presupuesto: monto,
	}));
  };

  const handleChangeProveedorTrabajo = (proveedorId) => {
	const proveedorSeleccionado = proveedoresActivos.find((p) => p._id === proveedorId);
	setTrabajoEditado((prev) => ({
		...prev,
		proveedorId,
		proveedor: proveedorSeleccionado
			? `${proveedorSeleccionado.nombre} ${proveedorSeleccionado.apellido}`.trim()
			: "Sin proveedor asignado",
	}));
  };

  // Guardar cambios de estado 
  const handleGuardarCambiosTrabajo = async () => {
	if (!trabajoEditado) return;

	try {
  	const trabajoOriginal = trabajos.find((t) => t.id === trabajoEditado.id);
  	let huboCambios = false;

  	// Cambio de estado
  	if (trabajoEditado.estado !== trabajoOriginal?.estado) {
    	await cambiarEstadoTrabajo(trabajoEditado.id, {
      	estadoNuevo: trabajoEditado.estado,
    	});
    	huboCambios = true;
  	}

  	// Cambio de monto
  	const montoNuevo = Number(trabajoEditado.presupuesto) || 0;
  	const montoOriginal = Number(trabajoOriginal?.presupuesto) || 0;
  	if (montoNuevo !== montoOriginal) {
    	await updateTrabajo(trabajoEditado.id, { monto: montoNuevo });
    	huboCambios = true;
  	}

	// Cambio de proveedor
  	if (
    	trabajoEditado.proveedorId &&
    	trabajoEditado.proveedorId !== trabajoOriginal?.proveedorId
  	) {
    	await asignarProveedor(trabajoEditado.id, {
      	proveedorId: trabajoEditado.proveedorId,
      	monto: montoNuevo,
    	});
    	huboCambios = true;
  	}	

  	if (huboCambios) {
    	await cargarTrabajos();
  	}

  	setIsCambiosGuardadosOpen(true);
	} catch (err) {
    	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo guardar el cambio";
  	alert(msg);
	}
  };


  // Crear trabajo 
  const handleChangeTrabajoDraft = (campo, valor) => {
	setTrabajoDraft((prev) => ({
  	...prev,
  	[campo]: valor,
	}));
  };

  const reiniciarTrabajoDraft = () => {
	setTrabajoDraft(DRAFT_INICIAL);
  };

  const handleCerrarCrearTrabajo = () => {
	setIsCrearTrabajoOpen(false);
	reiniciarTrabajoDraft();
  };

  const handleCrearTrabajo = async () => {
	// Validaciones mínimas
	if (!trabajoDraft.incidenciaId) {
  	alert("Seleccioná una incidencia.");
  	return;
	}
	if (!trabajoDraft.descripcion?.trim()) {
  	alert("Ingresá la descripción del trabajo.");
  	return;
	}

	try {
  	const payload = {
    	incidenciaId: trabajoDraft.incidenciaId,
    	descripcion: trabajoDraft.descripcion.trim(),
    	monto: Number(trabajoDraft.monto) || 0,
  	};

  	// Proveedor es opcional. 
  	if (trabajoDraft.proveedorId) {
    	payload.proveedorId = trabajoDraft.proveedorId;
  	}

  	await createTrabajo(payload);
  	await cargarTrabajos();

  	setIsCrearTrabajoOpen(false);
  	reiniciarTrabajoDraft();
  	setIsTrabajoSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo crear el trabajo";
  	alert(msg);
	}
  };

  const handleNuevoTrabajo = () => {
	setIsCrearTrabajoOpen(true);
  };

  
  // Eliminar trabajo 
  const solicitarEliminacionTrabajo = (trabajo) => {
	setTrabajoAEliminar({
  	...trabajo,
  	codigoTrabajo: obtenerCodigoTrabajo(trabajo),
	});
	setIsConfirmarEliminacionOpen(true);
  };

  const cancelarEliminacionTrabajo = () => {
	setTrabajoAEliminar(null);
	setIsConfirmarEliminacionOpen(false);
  };

  const confirmarEliminacionTrabajo = async () => {
	if (!trabajoAEliminar) return;

	try {
  	await deleteTrabajo(trabajoAEliminar.id);

  	await cargarTrabajos();

  	if (String(detalleTrabajoId) === String(trabajoAEliminar.id)) {
    	setSearchParams((prev) => {
      	const next = new URLSearchParams(prev);
      	next.delete("detalle");
      	return next;
    	});
  	}

  	if (trabajoEnEdicion?.id === trabajoAEliminar.id) {
    	setTrabajoEnEdicion(null);
    	setTrabajoEditado(null);
  	}

  	setIsConfirmarEliminacionOpen(false);
  	setTrabajoAEliminar(null);
  	setIsEliminacionSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cancelar el trabajo";
  	alert(msg);
	}
  };

  const cerrarModalEliminacionSuccess = () => {
	setIsEliminacionSuccessOpen(false);
  };

  const cerrarModalTrabajoCreadoSuccess = () => {
	setIsTrabajoSuccessOpen(false);
  };

  const cerrarModalCambiosGuardadosSuccess = () => {
	setIsCambiosGuardadosOpen(false);
  };

  return {
	// Datos
	trabajos,
	trabajosFiltrados,
	totalTrabajos: trabajos.length,
	loading,
	error,
	proveedoresActivos,
	incidenciasActivas,

	// Filtros
	busqueda,
	setBusqueda,
	estadoFiltro,
	setEstadoFiltro,
	proveedorFiltro,
	setProveedorFiltro,
	fechaFiltro,
	setFechaFiltro,
	proveedoresDisponibles,

	// Selección y edición
	trabajoSeleccionado,
	trabajoEnEdicion,
	trabajoEditado,

	// Modales
	isCrearTrabajoOpen,
	isTrabajoSuccessOpen,
	isCambiosGuardadosOpen,

	trabajoDraft,

	isConfirmarEliminacionOpen,
	trabajoAEliminar,
	isEliminacionSuccessOpen,

	// Handlers
	handleVerTrabajo,
	handleVolverListado,
	handleEditarTrabajo,
	handleChangeEstadoTrabajo,
	handleGuardarCambiosTrabajo,
	handleChangeMontoTrabajo,
	handleChangeProveedorTrabajo,

	handleNuevoTrabajo,
	handleCerrarCrearTrabajo,
	handleCrearTrabajo,
	handleChangeTrabajoDraft,

	solicitarEliminacionTrabajo,
	cancelarEliminacionTrabajo,
	confirmarEliminacionTrabajo,
	cerrarModalEliminacionSuccess,
	cerrarModalTrabajoCreadoSuccess,
	cerrarModalCambiosGuardadosSuccess,
	
  };
}

