import { useMemo, useState } from "react";
import { incidenciasAdminMock } from "../data/incidenciasAdminData";
import {
  clonarObjeto,
  obtenerDetalleIncidencia,
} from "../pages/admin/incidencias/utils/incidencias";
import {
  estaDentroDelRango,
  normalizarTexto,
} from "../pages/admin/incidencias/utils/fechas";

const ESTADO_INICIAL_TRABAJO = {
  titulo: "",
  descripcion: "",
  responsable: "",
  fechaInicioEstimada: "",
  costoEstimado: "",
  prioridad: "",
  aCargoDe: "",
};

export function useIncidenciasAdmin() {
  const [incidencias, setIncidencias] = useState(incidenciasAdminMock);

  const [edificioFiltro, setEdificioFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [unidadFiltro, setUnidadFiltro] = useState("Todas");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [incidenciaEnEdicion, setIncidenciaEnEdicion] = useState(null);
  const [incidenciaOriginalEdicion, setIncidenciaOriginalEdicion] =
    useState(null);

  const [isCrearTrabajoOpen, setIsCrearTrabajoOpen] = useState(false);
  const [isTrabajoSuccessOpen, setIsTrabajoSuccessOpen] = useState(false);
  const [trabajoDraft, setTrabajoDraft] = useState(ESTADO_INICIAL_TRABAJO);

  const [isConfirmarEliminacionOpen, setIsConfirmarEliminacionOpen] =
    useState(false);
  const [incidenciaAEliminar, setIncidenciaAEliminar] = useState(null);
  const [isEliminacionSuccessOpen, setIsEliminacionSuccessOpen] =
    useState(false);

  const edificiosDisponibles = useMemo(() => {
    return ["Todos", ...new Set(incidencias.map((i) => i.edificio))];
  }, [incidencias]);

  const unidadesDisponibles = useMemo(() => {
    return ["Todas", ...new Set(incidencias.map((i) => i.unidad))];
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
        normalizarTexto(`#${incidencia.id}`).includes(textoBusqueda) ||
        normalizarTexto(incidencia.titulo).includes(textoBusqueda) ||
        normalizarTexto(incidencia.creadoPor).includes(textoBusqueda) ||
        normalizarTexto(incidencia.categoria).includes(textoBusqueda) ||
        normalizarTexto(incidencia.unidad).includes(textoBusqueda) ||
        normalizarTexto(incidencia.edificio).includes(textoBusqueda) ||
        normalizarTexto(incidencia.estado).includes(textoBusqueda) ||
        String(incidencia.id).includes(textoBusqueda);

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

  const abrirDetalleIncidencia = (incidencia) => {
    setIncidenciaSeleccionada(obtenerDetalleIncidencia(incidencia));
    setIncidenciaEnEdicion(null);
    setIncidenciaOriginalEdicion(null);
  };

  const abrirEdicionIncidencia = (incidencia) => {
    const detalle = obtenerDetalleIncidencia(incidencia);

    setIncidenciaEnEdicion(clonarObjeto(detalle));
    setIncidenciaOriginalEdicion(clonarObjeto(detalle));
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
      const confirmarSalida = window.confirm(
        "Hay cambios sin guardar. ¿Deseás salir de todos modos?"
      );

      if (!confirmarSalida) return;
    }

    setIncidenciaEnEdicion(null);
    setIncidenciaOriginalEdicion(null);
  };

  const volverDesdeDetalleIncidencia = () => {
    setIncidenciaSeleccionada(null);
  };

  const guardarCambiosIncidencia = () => {
    if (!incidenciaEnEdicion) return;

    console.log("Incidencia editada:", incidenciaEnEdicion);

    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === incidenciaEnEdicion.id
          ? { ...incidencia, ...incidenciaEnEdicion }
          : incidencia
      )
    );

    setIncidenciaSeleccionada(incidenciaEnEdicion);
    setIncidenciaEnEdicion(null);
    setIncidenciaOriginalEdicion(null);
  };

  const abrirModalCrearTrabajo = () => {
    setTrabajoDraft(ESTADO_INICIAL_TRABAJO);
    setIsCrearTrabajoOpen(true);
  };

  const cerrarModalCrearTrabajo = () => {
    setIsCrearTrabajoOpen(false);
  };

  const actualizarTrabajoDraft = (campo, valor) => {
    setTrabajoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const aplicarNuevoTrabajo = (incidenciaActual, nuevoTrabajo) => {
    if (!incidenciaActual) return incidenciaActual;

    return {
      ...incidenciaActual,
      estado:
        incidenciaActual.estado === "Abierta"
          ? "Asignado"
          : incidenciaActual.estado,
      trabajosAsociados: [
        ...(incidenciaActual.trabajosAsociados || []),
        nuevoTrabajo,
      ],
    };
  };

  const confirmarCrearTrabajo = () => {
    const nuevoTrabajo = {
      id: Date.now(),
      titulo: trabajoDraft.titulo || "Nuevo trabajo",
      proveedor: trabajoDraft.responsable || "Responsable pendiente",
      fechaProgramada: trabajoDraft.fechaInicioEstimada || "Sin fecha",
      estado: "Asignado",
      descripcion: trabajoDraft.descripcion,
      costoEstimado: trabajoDraft.costoEstimado,
      prioridad: trabajoDraft.prioridad,
      aCargoDe: trabajoDraft.aCargoDe,
    };

    if (incidenciaSeleccionada) {
      setIncidenciaSeleccionada((prev) =>
        aplicarNuevoTrabajo(prev, nuevoTrabajo)
      );
    }

    if (incidenciaEnEdicion) {
      setIncidenciaEnEdicion((prev) =>
        aplicarNuevoTrabajo(prev, nuevoTrabajo)
      );
    }

    const incidenciaObjetivo = incidenciaEnEdicion || incidenciaSeleccionada;

    if (incidenciaObjetivo) {
      setIncidencias((prev) =>
        prev.map((incidencia) =>
          incidencia.id === incidenciaObjetivo.id
            ? aplicarNuevoTrabajo(
                obtenerDetalleIncidencia({
                  ...incidencia,
                  ...incidenciaObjetivo,
                }),
                nuevoTrabajo
              )
            : incidencia
        )
      );
    }

    setIsCrearTrabajoOpen(false);
    setIsTrabajoSuccessOpen(true);
  };

  const cerrarModalTrabajoExito = () => {
    setIsTrabajoSuccessOpen(false);
  };

  const solicitarEliminacionIncidencia = (incidencia) => {
    setIncidenciaAEliminar(incidencia);
    setIsConfirmarEliminacionOpen(true);
  };

  const cancelarEliminacionIncidencia = () => {
    setIncidenciaAEliminar(null);
    setIsConfirmarEliminacionOpen(false);
  };

  const confirmarEliminacionIncidencia = () => {
    if (!incidenciaAEliminar) return;

    const incidenciaId = incidenciaAEliminar.id;

    setIncidencias((prev) =>
      prev.filter((item) => item.id !== incidenciaId)
    );

    if (incidenciaSeleccionada?.id === incidenciaId) {
      setIncidenciaSeleccionada(null);
    }

    if (incidenciaEnEdicion?.id === incidenciaId) {
      setIncidenciaEnEdicion(null);
      setIncidenciaOriginalEdicion(null);
    }

    setIsConfirmarEliminacionOpen(false);
    setIncidenciaAEliminar(null);
    setIsEliminacionSuccessOpen(true);
  };

  const cerrarModalEliminacionSuccess = () => {
    setIsEliminacionSuccessOpen(false);
  };

  return {
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
    incidenciasFiltradas,
    totalIncidencias: incidencias.length,
    incidenciaSeleccionada,
    incidenciaEnEdicion,
    isCrearTrabajoOpen,
    isTrabajoSuccessOpen,
    trabajoDraft,
    abrirDetalleIncidencia,
    abrirEdicionIncidencia,
    volverDesdeEdicionIncidencia,
    guardarCambiosIncidencia,
    volverDesdeDetalleIncidencia,
    abrirModalCrearTrabajo,
    cerrarModalCrearTrabajo,
    actualizarTrabajoDraft,
    confirmarCrearTrabajo,
    cerrarModalTrabajoExito,
    actualizarCampoIncidencia,

    isConfirmarEliminacionOpen,
    incidenciaAEliminar,
    isEliminacionSuccessOpen,
    solicitarEliminacionIncidencia,
    cancelarEliminacionIncidencia,
    confirmarEliminacionIncidencia,
    cerrarModalEliminacionSuccess,
  };
}