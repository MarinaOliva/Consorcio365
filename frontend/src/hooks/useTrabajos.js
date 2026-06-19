import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { trabajosAdminMock } from "../data/trabajosAdminData";
import {
  TRABAJO_DRAFT_INICIAL,
  clonarObjeto,
  convertirMontoANumero,
  formatearFechaInput,
  obtenerCodigoTrabajo,
} from "../pages/admin/trabajos/utils/trabajos";
import {
  estaDentroDelRango,
  normalizarTexto,
} from "../pages/admin/trabajos/utils/fechas";

export function useTrabajosAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detalleTrabajoId = searchParams.get("detalle");

  const [trabajos, setTrabajos] = useState(trabajosAdminMock);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [proveedorFiltro, setProveedorFiltro] = useState("Todos");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  const [isCrearTrabajoOpen, setIsCrearTrabajoOpen] = useState(false);
  const [isTrabajoSuccessOpen, setIsTrabajoSuccessOpen] = useState(false);

  const [trabajoEnEdicion, setTrabajoEnEdicion] = useState(null);
  const [trabajoEditado, setTrabajoEditado] = useState(null);
  const [isCambiosGuardadosOpen, setIsCambiosGuardadosOpen] = useState(false);

  const [trabajoDraft, setTrabajoDraft] = useState(TRABAJO_DRAFT_INICIAL);

  const [isConfirmarEliminacionOpen, setIsConfirmarEliminacionOpen] =
    useState(false);
  const [trabajoAEliminar, setTrabajoAEliminar] = useState(null);
  const [isEliminacionSuccessOpen, setIsEliminacionSuccessOpen] =
    useState(false);

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

  const proveedoresDisponibles = useMemo(() => {
    return [...new Set(trabajos.map((trabajo) => trabajo.proveedor))].filter(
      Boolean
    );
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

  const handleGuardarCambiosTrabajo = () => {
    if (!trabajoEditado) return;

    setTrabajos((prev) =>
      prev.map((trabajo) =>
        trabajo.id === trabajoEditado.id ? trabajoEditado : trabajo
      )
    );

    setTrabajoEnEdicion(trabajoEditado);
    setIsCambiosGuardadosOpen(true);
  };

  const handleChangeTrabajoDraft = (campo, valor) => {
    setTrabajoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const reiniciarTrabajoDraft = () => {
    setTrabajoDraft(TRABAJO_DRAFT_INICIAL);
  };

  const handleCerrarCrearTrabajo = () => {
    setIsCrearTrabajoOpen(false);
    reiniciarTrabajoDraft();
  };

  const handleCrearTrabajo = () => {
    const maxNumeroIncidencia = Math.max(
      0,
      ...trabajos.map((trabajo) => Number(trabajo.numeroIncidencia) || 0)
    );

    const nuevoTrabajo = {
      id: Date.now(),
      numeroIncidencia:
        trabajoDraft.numeroIncidencia || String(maxNumeroIncidencia + 1),
      incidencia: trabajoDraft.titulo || "Trabajo sin título",
      origen: trabajoDraft.origen || "Manual",
      estado: trabajoDraft.estado || "Asignado",
      proveedor: trabajoDraft.responsable || "Sin proveedor asignado",
      presupuesto: convertirMontoANumero(trabajoDraft.costoEstimado),
      fecha:
        formatearFechaInput(trabajoDraft.fechaInicioEstimada) ||
        new Date().toLocaleDateString("es-AR"),
      descripcion: trabajoDraft.descripcion,
      prioridad: trabajoDraft.prioridad,
      aCargoDe: trabajoDraft.aCargoDe,
      categoria: trabajoDraft.categoria,
      unidad: trabajoDraft.unidad,
      piso: trabajoDraft.piso,
      edificio: trabajoDraft.edificio,
    };

    setTrabajos((prev) => [nuevoTrabajo, ...prev]);

    setIsCrearTrabajoOpen(false);
    reiniciarTrabajoDraft();
    setIsTrabajoSuccessOpen(true);
  };

  const handleNuevoTrabajo = () => {
    setIsCrearTrabajoOpen(true);
  };

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

  const confirmarEliminacionTrabajo = () => {
    if (!trabajoAEliminar) return;

    const trabajoId = trabajoAEliminar.id;

    setTrabajos((prev) => prev.filter((item) => item.id !== trabajoId));

    if (String(detalleTrabajoId) === String(trabajoId)) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("detalle");
        return next;
      });
    }

    if (trabajoEnEdicion?.id === trabajoId) {
      setTrabajoEnEdicion(null);
      setTrabajoEditado(null);
    }

    setIsConfirmarEliminacionOpen(false);
    setTrabajoAEliminar(null);
    setIsEliminacionSuccessOpen(true);
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
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    proveedorFiltro,
    setProveedorFiltro,
    fechaFiltro,
    setFechaFiltro,
    proveedoresDisponibles,
    trabajosFiltrados,
    totalTrabajos: trabajos.length,

    trabajoSeleccionado,
    trabajoEnEdicion,
    trabajoEditado,

    isCrearTrabajoOpen,
    isTrabajoSuccessOpen,
    isCambiosGuardadosOpen,

    trabajoDraft,

    isConfirmarEliminacionOpen,
    trabajoAEliminar,
    isEliminacionSuccessOpen,

    handleVerTrabajo,
    handleVolverListado,
    handleEditarTrabajo,
    handleChangeEstadoTrabajo,
    handleGuardarCambiosTrabajo,

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