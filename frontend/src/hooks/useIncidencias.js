import { useEffect, useMemo, useState } from "react";

import {
  getIncidencias,
  cambiarEstadoIncidencia,
  updateIncidencia,
  deleteIncidencia,
  createIncidencia,
} from "../services/incidenciasService";

import { getTrabajos, createTrabajo } from "../services/trabajosService";
import { getUsuarios } from "../services/usersService";
import { getEdificios } from "../services/edificiosService";

import { clonarObjeto } from "../pages/admin/incidencias/utils/incidencias";

import {
  estaDentroDelRango,
  normalizarTexto,
} from "../pages/admin/incidencias/utils/fechas";

// Adaptador
function adaptarIncidenciaDelBack(incidenciaBack, trabajosAsociados = []) {
  const ocupante = incidenciaBack.ocupanteId;
  const edificio = incidenciaBack.edificioId;

  const comentariosFormateados = (incidenciaBack.comentarios || []).map(
	(c, idx) => ({
  	id: c._id || `c-${idx}`,
  	tipo: "comentario",
  	titulo: "Comentario agregado",
  	fecha: c.fecha ? new Date(c.fecha).toLocaleDateString("es-AR") : "",
  	hora: c.fecha
    	? new Date(c.fecha).toLocaleTimeString("es-AR", {
        	hour: "2-digit",
        	minute: "2-digit",
      	}) + " hs"
    	: "",
  	usuario: c.usuarioId?.nombre
    	? `${c.usuarioId.nombre} ${c.usuarioId.apellido || ""}`.trim()
    	: "Usuario",
  	descripcion: c.texto || "",
  	_fechaIso: c.fecha,
	})
  );

  const historialEstadosFormateado = (incidenciaBack.historialEstados || []).map(
	(h, idx) => ({
  	id: h._id || `h-${idx}`,
  	tipo: "estado",
  	titulo: "Estado actualizado",
  	fecha: h.fecha ? new Date(h.fecha).toLocaleDateString("es-AR") : "",
  	hora: h.fecha
    	? new Date(h.fecha).toLocaleTimeString("es-AR", {
        	hour: "2-digit",
        	minute: "2-digit",
      	}) + " hs"
    	: "",
  	usuario: h.creadoPorId?.nombre
    	? `${h.creadoPorId.nombre} ${h.creadoPorId.apellido || ""}`.trim()
    	: "Sistema",
  	descripcion: `La incidencia pasó al estado ${h.estadoNuevo}.${
    	h.observacion ? ` ${h.observacion}` : ""
  	}`,
  	_fechaIso: h.fecha,
	})
  );

  const entradaCreada = {
	id: `creada-${incidenciaBack._id}`,
	tipo: "creada",
	titulo: "Incidencia creada",
	fecha: incidenciaBack.createdAt
  	? new Date(incidenciaBack.createdAt).toLocaleDateString("es-AR")
  	: "",
	hora: incidenciaBack.createdAt
  	? new Date(incidenciaBack.createdAt).toLocaleTimeString("es-AR", {
      	hour: "2-digit",
      	minute: "2-digit",
    	}) + " hs"
  	: "",
	usuario: ocupante
  	? `${ocupante.nombre || ""} ${ocupante.apellido || ""}`.trim()
  	: "Ocupante",
	descripcion: "Se reportó la incidencia desde la unidad indicada.",
	_fechaIso: incidenciaBack.createdAt,
  };

  const historialCompleto = [
	entradaCreada,
	...historialEstadosFormateado,
	...comentariosFormateados,
  ].sort((a, b) => {
	const fa = a._fechaIso ? new Date(a._fechaIso).getTime() : 0;
	const fb = b._fechaIso ? new Date(b._fechaIso).getTime() : 0;
	return fa - fb;
  });

  const trabajosDeEsta = trabajosAsociados
	.filter((t) => {
  	const incId = t.incidenciaId?._id || t.incidenciaId;
  	return incId === incidenciaBack._id;
	})
	.map((t) => ({
  	id: t._id,
  	titulo: t.descripcion || "Trabajo",
  	proveedor: t.proveedorId
    	? `${t.proveedorId.nombre || ""} ${t.proveedorId.apellido || ""}`.trim()
    	: "Sin proveedor",
  	fechaProgramada: t.createdAt
    	? new Date(t.createdAt).toLocaleDateString("es-AR")
    	: "—",
  	estado: t.estado,
	}));

  const evidenciasFormateadas = (incidenciaBack.fotos || []).map((url, idx) => ({
	url,
	label: `Foto ${idx + 1}`,
  }));

  return {
	id: incidenciaBack._id,
	_id: incidenciaBack._id,

	titulo: incidenciaBack.titulo,
	descripcion: incidenciaBack.descripcion || "",
	categoria: incidenciaBack.categoria || "",
	prioridad: incidenciaBack.prioridad || "media",
	estado: incidenciaBack.estado,

	edificio: edificio?.nombre || "—",
	edificioId: edificio?._id || null,

	unidad: incidenciaBack.espacio || "—",
	espacio: incidenciaBack.espacio || "",

	creadoPor: ocupante
  	? `${ocupante.nombre || ""} ${ocupante.apellido || ""}`.trim()
  	: "—",
	ocupanteId: ocupante?._id || null,

	fechaCreacion: incidenciaBack.createdAt
  	? new Date(incidenciaBack.createdAt).toLocaleDateString("es-AR")
  	: "",
	fechaCreacionCompleta: incidenciaBack.createdAt
  	? `${new Date(incidenciaBack.createdAt).toLocaleDateString(
      	"es-AR"
    	)} ${new Date(incidenciaBack.createdAt).toLocaleTimeString("es-AR", {
      	hour: "2-digit",
      	minute: "2-digit",
    	})} hs`
  	: "",
	fechaCreacionISO: incidenciaBack.createdAt,

	fotos: incidenciaBack.fotos || [],
	evidencias: evidenciasFormateadas,
	historial: historialCompleto,
	trabajosAsociados: trabajosDeEsta,

	_raw: incidenciaBack,
  };
}

export function useIncidenciasAdmin() {
  // Datos
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ocupantesActivos, setOcupantesActivos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [modalNuevaIncidenciaAbierto, setModalNuevaIncidenciaAbierto] = useState(false);
  const [modalIncidenciaCreadaAbierto, setModalIncidenciaCreadaAbierto] = useState(false);
  const [nuevaIncidenciaDraft, setNuevaIncidenciaDraft] = useState({
	edificioId: "",
	ocupanteId: "",
	espacio: "",
	titulo: "",
	descripcion: "",
	categoria: "",
	prioridad: "media",
	});

  // Filtros
  const [edificioFiltro, setEdificioFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [unidadFiltro, setUnidadFiltro] = useState("Todas");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Selección y edición
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [incidenciaEnEdicion, setIncidenciaEnEdicion] = useState(null);
  const [incidenciaOriginalEdicion, setIncidenciaOriginalEdicion] = useState(null);

  // Modal éxito edición
  const [isCambiosGuardadosOpen, setIsCambiosGuardadosOpen] = useState(false);

  // Modal eliminación
  const [isConfirmarEliminacionOpen, setIsConfirmarEliminacionOpen] = useState(false);
  const [incidenciaAEliminar, setIncidenciaAEliminar] = useState(null);
  const [isEliminacionSuccessOpen, setIsEliminacionSuccessOpen] = useState(false);

  // Crear trabajo desde incidencia
  const [proveedoresActivos, setProveedoresActivos] = useState([]);
  const [modalCrearTrabajoAbierto, setModalCrearTrabajoAbierto] = useState(false);
  const [modalTrabajoCreadoAbierto, setModalTrabajoCreadoAbierto] = useState(false);
  const [trabajoDraft, setTrabajoDraft] = useState({
	descripcion: "",
	proveedorId: "",
	monto: 0,
  });

  // Carga inicial
  const cargarIncidencias = async () => {
	try {
  	setLoading(true);
  	setError("");

  	const [data, trabajos] = await Promise.all([
    	getIncidencias(),
    	getTrabajos(),
  	]);

  	const adaptadas = data.map((inc) =>
    	adaptarIncidenciaDelBack(inc, trabajos)
  	);
  	setIncidencias(adaptadas);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar las incidencias";
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

  const cargarOcupantes = async () => {
  try {
	const data = await getUsuarios({ tipo: "ocupante", estado: "ACTIVO" });
	setOcupantesActivos(data || []);
  } catch (err) {
	console.warn("No se pudieron cargar los ocupantes:", err);
  }
};

	const cargarEdificios = async () => {
	try {
		const data = await getEdificios();
		setEdificios(data || []);
	} catch (err) {
		console.warn("No se pudieron cargar los edificios:", err);
	}
	};

  useEffect(() => {
	cargarIncidencias();
	cargarProveedores();
	cargarOcupantes();
	cargarEdificios();
  }, []);

  // Filtros derivados
  const edificiosDisponibles = useMemo(() => {
	return ["Todos", ...new Set(incidencias.map((i) => i.edificio).filter(Boolean))];
  }, [incidencias]);

  const unidadesDisponibles = useMemo(() => {
	return ["Todas", ...new Set(incidencias.map((i) => i.unidad).filter(Boolean))];
  }, [incidencias]);

  const incidenciasFiltradas = useMemo(() => {
	return incidencias.filter((incidencia) => {
  	const coincideEdificio =
    	edificioFiltro === "Todos" || incidencia.edificio === edificioFiltro;

  	const coincideEstado =
    	estadoFiltro === "Todos" || incidencia.estado === estadoFiltro;

  	const coincideUnidad =
    	unidadFiltro === "Todas" || incidencia.unidad === unidadFiltro;

  	const coincideFecha = estaDentroDelRango(
    	incidencia.fechaCreacion,
    	fechaFiltro
  	);

  	const textoBusqueda = busqueda.toLowerCase();
  	const textoBusquedaSinNumeral = textoBusqueda.replace("#", "");
  	const idNormalizado = normalizarTexto(incidencia.id);

  	const coincideBusqueda =
    	textoBusqueda === "" ||
    	idNormalizado.includes(textoBusquedaSinNumeral) ||
    	normalizarTexto(incidencia.titulo).includes(textoBusqueda) ||
    	normalizarTexto(incidencia.creadoPor).includes(textoBusqueda) ||
    	normalizarTexto(incidencia.categoria).includes(textoBusqueda) ||
    	normalizarTexto(incidencia.unidad).includes(textoBusqueda) ||
    	normalizarTexto(incidencia.edificio).includes(textoBusqueda) ||
    	normalizarTexto(incidencia.estado).includes(textoBusqueda);

  	return (
    	coincideEdificio &&
    	coincideEstado &&
    	coincideUnidad &&
    	coincideFecha &&
    	coincideBusqueda
  	);
	});
  }, [
	incidencias,
	edificioFiltro,
	estadoFiltro,
	unidadFiltro,
	fechaFiltro,
	busqueda,
  ]);

  // Acciones detalle / edición
  const abrirDetalleIncidencia = (incidencia) => {
	setIncidenciaSeleccionada(incidencia);
	setIncidenciaEnEdicion(null);
	setIncidenciaOriginalEdicion(null);
  };

  const abrirEdicionIncidencia = (incidencia) => {
	const copia = clonarObjeto(incidencia);
	setIncidenciaEnEdicion(copia);
	setIncidenciaOriginalEdicion(clonarObjeto(incidencia));
	setIncidenciaSeleccionada(null);
  };

  const actualizarCampoIncidencia = (campo, valor) => {
	setIncidenciaEnEdicion((prev) => ({
  	...prev,
  	[campo]: valor,
	}));
  };

  const hayCambiosPendientesIncidencia = () => {
	if (!incidenciaEnEdicion || !incidenciaOriginalEdicion) return false;
	return (
  	incidenciaEnEdicion.estado !== incidenciaOriginalEdicion.estado ||
  	incidenciaEnEdicion.prioridad !== incidenciaOriginalEdicion.prioridad
	);
  };

  const volverDesdeEdicionIncidencia = () => {
	if (hayCambiosPendientesIncidencia()) {
  	const confirmar = window.confirm(
    	"Hay cambios sin guardar. ¿Deseás salir de todos modos?"
  	);
  	if (!confirmar) return;
	}

	setIncidenciaEnEdicion(null);
	setIncidenciaOriginalEdicion(null);
  };

  const volverDesdeDetalleIncidencia = () => {
	setIncidenciaSeleccionada(null);
  };

  const guardarCambiosIncidencia = async () => {
	if (!incidenciaEnEdicion || !incidenciaOriginalEdicion) return;

	try {
  	let huboCambios = false;

  	if (incidenciaEnEdicion.estado !== incidenciaOriginalEdicion.estado) {
    	await cambiarEstadoIncidencia(incidenciaEnEdicion.id, {
      	estadoNuevo: incidenciaEnEdicion.estado,
    	});
    	huboCambios = true;
  	}

  	if (incidenciaEnEdicion.prioridad !== incidenciaOriginalEdicion.prioridad) {
    	await updateIncidencia(incidenciaEnEdicion.id, {
      	prioridad: incidenciaEnEdicion.prioridad,
    	});
    	huboCambios = true;
  	}

  	if (huboCambios) {
    	await cargarIncidencias();
  	}

  	const idEditada = incidenciaEnEdicion.id;
  	setIncidenciaEnEdicion(null);
  	setIncidenciaOriginalEdicion(null);

  	setIsCambiosGuardadosOpen(true);

  	setTimeout(() => {
    	setIncidencias((current) => {
      	const actualizada = current.find((i) => i.id === idEditada);
      	if (actualizada) setIncidenciaSeleccionada(actualizada);
      	return current;
    	});
  	}, 0);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo guardar la incidencia";
  	alert(msg);
	}
  };

  const cerrarModalCambiosGuardados = () => {
	setIsCambiosGuardadosOpen(false);
  };

  // Eliminar
  const solicitarEliminacionIncidencia = (incidencia) => {
	setIncidenciaAEliminar(incidencia);
	setIsConfirmarEliminacionOpen(true);
  };

  const cancelarEliminacionIncidencia = () => {
	setIncidenciaAEliminar(null);
	setIsConfirmarEliminacionOpen(false);
  };

  const confirmarEliminacionIncidencia = async () => {
	if (!incidenciaAEliminar) return;

	try {
  	await deleteIncidencia(incidenciaAEliminar.id);
  	await cargarIncidencias();

  	const idEliminada = incidenciaAEliminar.id;
  	if (incidenciaSeleccionada?.id === idEliminada) {
    	setIncidenciaSeleccionada(null);
  	}
  	if (incidenciaEnEdicion?.id === idEliminada) {
    	setIncidenciaEnEdicion(null);
    	setIncidenciaOriginalEdicion(null);
  	}

  	setIsConfirmarEliminacionOpen(false);
  	setIncidenciaAEliminar(null);
  	setIsEliminacionSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cancelar la incidencia";
  	alert(msg);
	}
  };

  const cerrarModalEliminacionSuccess = () => {
	setIsEliminacionSuccessOpen(false);
  };

  // Crear trabajo desde incidencia
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

  const handleCrearTrabajoDesdeIncidencia = async () => {
	const incidenciaContexto = incidenciaSeleccionada || incidenciaEnEdicion;
	if (!incidenciaContexto?.id) {
  	alert("No hay una incidencia seleccionada.");
  	return;
	}
	if (!trabajoDraft.descripcion?.trim()) {
  	alert("Ingresá la descripción del trabajo.");
  	return;
	}

	try {
  	const payload = {
    	incidenciaId: incidenciaContexto.id,
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
  	alert(msg);
	}
  };

  const cerrarModalTrabajoCreado = async () => {
	setModalTrabajoCreadoAbierto(false);
	await cargarIncidencias();
 
	const idActual =
  	incidenciaSeleccionada?.id || incidenciaEnEdicion?.id;
	if (idActual) {
  	setTimeout(() => {
    	setIncidencias((current) => {
      	const actualizada = current.find((i) => i.id === idActual);
      	if (actualizada) {
        	if (incidenciaEnEdicion) {
          	setIncidenciaEnEdicion(null);
        	}
        	setIncidenciaSeleccionada(actualizada);
      	}
      	return current;
    	});
  	}, 0);
	}
  };

// Crear nueva incidencia (admin)
const abrirModalNuevaIncidencia = () => {
  setNuevaIncidenciaDraft({
	edificioId: edificios[0]?._id || "",
	ocupanteId: "",
	espacio: "",
	titulo: "",
	descripcion: "",
	categoria: "",
	prioridad: "media",
  });
  setModalNuevaIncidenciaAbierto(true);
};

const cerrarModalNuevaIncidencia = () => {
  setModalNuevaIncidenciaAbierto(false);
};

const handleChangeNuevaIncidencia = (campo, valor) => {
  setNuevaIncidenciaDraft((prev) => ({
	...prev,
	[campo]: valor,
  }));
};

const handleCrearNuevaIncidencia = async () => {
  if (!nuevaIncidenciaDraft.titulo?.trim()) {
	alert("Ingresá un título.");
	return;
  }
  if (!nuevaIncidenciaDraft.descripcion?.trim()) {
	alert("Ingresá una descripción.");
	return;
  }
  if (!nuevaIncidenciaDraft.categoria) {
	alert("Seleccioná una categoría.");
	return;
  }
  if (!nuevaIncidenciaDraft.ocupanteId) {
	alert("Seleccioná el ocupante reportante.");
	return;
  }
  if (!nuevaIncidenciaDraft.edificioId) {
	alert("Seleccioná el edificio.");
	return;
  }

  try {
	const payload = {
  	edificioId: nuevaIncidenciaDraft.edificioId,
  	ocupanteId: nuevaIncidenciaDraft.ocupanteId,
  	espacio: nuevaIncidenciaDraft.espacio?.trim() || null,
  	titulo: nuevaIncidenciaDraft.titulo.trim(),
  	descripcion: nuevaIncidenciaDraft.descripcion.trim(),
  	categoria: nuevaIncidenciaDraft.categoria,
  	prioridad: nuevaIncidenciaDraft.prioridad || "media",
	};

	await createIncidencia(payload);
	setModalNuevaIncidenciaAbierto(false);
	setModalIncidenciaCreadaAbierto(true);
  } catch (err) {
	const msg =
  	err?.response?.data?.message ||
  	err?.message ||
  	"No se pudo crear la incidencia";
	alert(msg);
  }
};

const cerrarModalIncidenciaCreada = async () => {
  setModalIncidenciaCreadaAbierto(false);
  await cargarIncidencias();
};



  // Datos para preseleccionar incidencia en el modal
  const incidenciaPreseleccionada = useMemo(() => {
	const inc = incidenciaSeleccionada || incidenciaEnEdicion;
	if (!inc) return null;
	return {
  	_id: inc.id,
  	titulo: inc.titulo,
  	categoria: inc.categoria,
  	edificio: inc.edificio,
  	unidad: inc.unidad,
	};
  }, [incidenciaSeleccionada, incidenciaEnEdicion]);

  return {
	// Datos
	incidenciasFiltradas,
	totalIncidencias: incidencias.length,
	loading,
	error,

	// Filtros
	edificioFiltro,
	setEdificioFiltro,
	estadoFiltro,
	setEstadoFiltro,
	unidadFiltro,
	setUnidadFiltro,
	fechaFiltro,
	setFechaFiltro,
	busqueda,
	setBusqueda,
	edificiosDisponibles,
	unidadesDisponibles,

	// Selección y edición
	incidenciaSeleccionada,
	incidenciaEnEdicion,
	abrirDetalleIncidencia,
	abrirEdicionIncidencia,
	volverDesdeEdicionIncidencia,
	volverDesdeDetalleIncidencia,
	actualizarCampoIncidencia,
	guardarCambiosIncidencia,
	isCambiosGuardadosOpen,
	cerrarModalCambiosGuardados,

	// Eliminación
	isConfirmarEliminacionOpen,
	incidenciaAEliminar,
	isEliminacionSuccessOpen,
	solicitarEliminacionIncidencia,
	cancelarEliminacionIncidencia,
	confirmarEliminacionIncidencia,
	cerrarModalEliminacionSuccess,

	// Crear trabajo desde incidencia
	proveedoresActivos,
	incidenciaPreseleccionada,
	modalCrearTrabajoAbierto,
	abrirModalCrearTrabajo,
	cerrarModalCrearTrabajo,
	trabajoDraft,
	handleChangeTrabajoDraft,
	handleCrearTrabajoDesdeIncidencia,
	modalTrabajoCreadoAbierto,
	cerrarModalTrabajoCreado,

	// crear incidencia
	ocupantesActivos,
	edificios,
	modalNuevaIncidenciaAbierto,
	abrirModalNuevaIncidencia,
	cerrarModalNuevaIncidencia,
	nuevaIncidenciaDraft,
	handleChangeNuevaIncidencia,
	handleCrearNuevaIncidencia,
	modalIncidenciaCreadaAbierto,
	cerrarModalIncidenciaCreada,
  };
}
