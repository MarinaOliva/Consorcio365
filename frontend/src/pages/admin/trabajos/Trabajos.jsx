import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import CrearTrabajoModal from "../../../components/admin/CrearTrabajoModal";
import SuccessModal from "../../../components/shared/SuccessModal";
import ModalConfirmacion from "../../../components/shared/ModalConfirmacion";

import VistaListadoTrabajos from "./componentes/VistaListadoTrabajos";
import VistaDetalleTrabajo from "./componentes/VistaDetalleTrabajo";
import VistaEdicionTrabajo from "./componentes/VistaEdicionTrabajo";
import { useTrabajosAdmin } from "../../../hooks/useTrabajos";

function Trabajos() {
  const {
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
    totalTrabajos,

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
  } = useTrabajosAdmin();

  const subtitulo = trabajoEnEdicion && trabajoEditado
    ? `Editar trabajo > ID #${trabajoEditado.codigoTrabajo || trabajoEditado.id}`
    : trabajoSeleccionado
    ? `Detalle de trabajo > ID #${trabajoSeleccionado.codigoTrabajo || trabajoSeleccionado.id}`
    : "Gestión y seguimiento de trabajos";

  return (
    <ContenedorPanelPorRol titulo="Trabajos" subtitulo={subtitulo}>
      {trabajoSeleccionado ? (
        <VistaDetalleTrabajo
          trabajo={trabajoSeleccionado}
          onVolver={handleVolverListado}
        />
      ) : trabajoEnEdicion && trabajoEditado ? (
        <VistaEdicionTrabajo
          trabajo={trabajoEditado}
          estadoEditable={trabajoEditado.estado}
          onEstadoChange={handleChangeEstadoTrabajo}
          onVolver={() => {
            handleVolverListado();
          }}
          onGuardar={handleGuardarCambiosTrabajo}
        />
      ) : (
        <VistaListadoTrabajos
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
          proveedorFiltro={proveedorFiltro}
          setProveedorFiltro={setProveedorFiltro}
          fechaFiltro={fechaFiltro}
          setFechaFiltro={setFechaFiltro}
          proveedoresDisponibles={proveedoresDisponibles}
          trabajos={trabajosFiltrados}
          totalTrabajos={totalTrabajos}
          onNuevoTrabajo={handleNuevoTrabajo}
          onVerTrabajo={handleVerTrabajo}
          onEditarTrabajo={handleEditarTrabajo}
          onEliminarTrabajo={solicitarEliminacionTrabajo}
        />
      )}

      <CrearTrabajoModal
        isOpen={isCrearTrabajoOpen}
        onClose={handleCerrarCrearTrabajo}
        onCreate={handleCrearTrabajo}
        incidencia={null}
        values={trabajoDraft}
        onChange={handleChangeTrabajoDraft}
        modo="manual"
      />

      <SuccessModal
        isOpen={isTrabajoSuccessOpen}
        onClose={cerrarModalTrabajoCreadoSuccess}
        message="Trabajo creado con éxito"
      />

      <SuccessModal
        isOpen={isCambiosGuardadosOpen}
        onClose={cerrarModalCambiosGuardadosSuccess}
        message="Cambios guardados con éxito"
      />

      <ModalConfirmacion
        isOpen={isConfirmarEliminacionOpen}
        title="Confirmar eliminación"
        message={
          trabajoAEliminar
            ? `¿Querés eliminar el trabajo #${trabajoAEliminar.codigoTrabajo || trabajoAEliminar.id}?`
            : "¿Querés continuar con esta acción?"
        }
        confirmLabel="Eliminar trabajo"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmarEliminacionTrabajo}
        onClose={cancelarEliminacionTrabajo}
        details={
          trabajoAEliminar
            ? [
                { label: "Trabajo", value: trabajoAEliminar.incidencia || "-" },
                { label: "Proveedor", value: trabajoAEliminar.proveedor || "-" },
                { label: "Estado", value: trabajoAEliminar.estado || "-" },
                { label: "Fecha", value: trabajoAEliminar.fecha || "-" },
              ]
            : []
        }
      />

      <SuccessModal
        isOpen={isEliminacionSuccessOpen}
        onClose={cerrarModalEliminacionSuccess}
        message="Trabajo eliminado con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default Trabajos;