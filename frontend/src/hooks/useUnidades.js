import { useMemo, useState } from "react";
import { unidadesAdminMock } from "../data/unidadesAdminData";

import { clonarDato } from "../pages/admin/unidades/utils/clonarDatos";
import { filtrarUnidades } from "../pages/admin/unidades/utils/filtrarUnidades";
import { etiquetaEstadoUnidad } from "../pages/admin/unidades/utils/normalizarEstadoUnidad";

export function useUnidadesAdmin() {
  const [unidades, setUnidades] = useState(unidadesAdminMock);
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [unidadEnEdicion, setUnidadEnEdicion] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Cambios guardados con éxito"
  );

  const unidadesFiltradas = useMemo(() => {
    return filtrarUnidades(unidades, { estadoFiltro, busqueda });
  }, [unidades, estadoFiltro, busqueda]);

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

  const actualizarRelacionUsuario = (usuarioId, campo, valor) => {
    setUnidadEnEdicion((prev) => ({
      ...prev,
      usuarios: (prev?.usuarios || []).map((usuario) =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              [campo]: valor,
            }
          : usuario
      ),
    }));
  };

  const finalizarRelacionUsuario = (usuarioId) => {
    const fechaActual = new Date().toLocaleDateString("es-AR");

    setUnidadEnEdicion((prev) => ({
      ...prev,
      usuarios: (prev?.usuarios || []).map((usuario) =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              hasta: fechaActual,
              estadoRelacion: "Finalizada",
            }
          : usuario
      ),
    }));
  };

  const guardarCambiosUnidad = () => {
    if (!unidadEnEdicion) return;

    const unidadActualizada = {
      ...unidadEnEdicion,
      estado: etiquetaEstadoUnidad(unidadEnEdicion.estado),
    };

    setUnidades((prev) =>
      prev.map((unidad) =>
        unidad.id === unidadActualizada.id ? unidadActualizada : unidad
      )
    );

    setUnidadSeleccionada(unidadActualizada);
    setUnidadEnEdicion(null);
    setSuccessMessage("Cambios guardados con éxito");
    setIsSuccessOpen(true);

    // Cuando tengas endpoint:
    // await actualizarUnidadRequest(unidadActualizada)
    console.log("Unidad editada:", unidadActualizada);
  };

  return {
    estadoFiltro,
    setEstadoFiltro,
    busqueda,
    setBusqueda,
    unidadesFiltradas,
    totalUnidades: unidades.length,
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