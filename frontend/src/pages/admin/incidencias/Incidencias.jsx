import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import CrearTrabajoModal from "../../../components/admin/CrearTrabajoModal";
import SuccessModal from "../../../components/shared/SuccessModal";
import ModalConfirmacion from "../../../components/shared/ModalConfirmacion";

import VistaListadoIncidencias from "./componentes/VistaListadoIncidencias";
import VistaDetalleIncidencia from "./componentes/VistaDetalleIncidencia";
import VistaEdicionIncidencia from "./componentes/VistaEdicionIncidencia";
import { useIncidenciasAdmin } from "../../../hooks/useIncidencias";

function Incidencias() {
  const {
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
    totalIncidencias,
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
  } = useIncidenciasAdmin();

  const subtitulo = incidenciaEnEdicion
    ? `Editar incidencia > ID #${incidenciaEnEdicion.id}`
    : incidenciaSeleccionada
    ? `Detalle de incidencia > ID #${incidenciaSeleccionada.id}`
    : "Gestión de reportes y reclamos";

  const incidenciaActiva = incidenciaEnEdicion || incidenciaSeleccionada;

  return (
    <ContenedorPanelPorRol titulo="Incidencias" subtitulo={subtitulo}>
      <section className="mx-auto max-w-[1120px] space-y-5">
        {incidenciaEnEdicion ? (
          <VistaEdicionIncidencia
            incidencia={incidenciaEnEdicion}
            onVolver={volverDesdeEdicionIncidencia}
            onGuardar={guardarCambiosIncidencia}
            onCrearTrabajo={abrirModalCrearTrabajo}
            onActualizarCampo={actualizarCampoIncidencia}
          />
        ) : incidenciaSeleccionada ? (
          <VistaDetalleIncidencia
            incidencia={incidenciaSeleccionada}
            onVolver={volverDesdeDetalleIncidencia}
            onCrearTrabajo={abrirModalCrearTrabajo}
          />
        ) : (
          <VistaListadoIncidencias
            edificioFiltro={edificioFiltro}
            estadoFiltro={estadoFiltro}
            unidadFiltro={unidadFiltro}
            fechaFiltro={fechaFiltro}
            busqueda={busqueda}
            edificiosDisponibles={edificiosDisponibles}
            unidadesDisponibles={unidadesDisponibles}
            incidencias={incidenciasFiltradas}
            totalIncidencias={totalIncidencias}
            onCambiarEdificio={setEdificioFiltro}
            onCambiarEstado={setEstadoFiltro}
            onCambiarUnidad={setUnidadFiltro}
            onCambiarFecha={setFechaFiltro}
            onCambiarBusqueda={setBusqueda}
            onVer={abrirDetalleIncidencia}
            onEditar={abrirEdicionIncidencia}
            onEliminar={solicitarEliminacionIncidencia}
          />
        )}
      </section>

      <CrearTrabajoModal
        isOpen={isCrearTrabajoOpen}
        onClose={cerrarModalCrearTrabajo}
        onCreate={confirmarCrearTrabajo}
        values={trabajoDraft}
        onChange={actualizarTrabajoDraft}
        incidencia={incidenciaActiva}
        modo="incidencia"
      />

      <SuccessModal
        isOpen={isTrabajoSuccessOpen}
        onClose={cerrarModalTrabajoExito}
        message="Trabajo creado con éxito"
      />

      <ModalConfirmacion
        isOpen={isConfirmarEliminacionOpen}
        title="Confirmar eliminación"
        message={
          incidenciaAEliminar
            ? `¿Querés eliminar la incidencia #${incidenciaAEliminar.id}?`
            : "¿Querés eliminar esta incidencia?"
        }
        confirmLabel="Eliminar incidencia"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmarEliminacionIncidencia}
        onClose={cancelarEliminacionIncidencia}
        details={
          incidenciaAEliminar
            ? [
                { label: "Título", value: incidenciaAEliminar.titulo || "-" },
                { label: "Edificio", value: incidenciaAEliminar.edificio || "-" },
                { label: "Unidad", value: incidenciaAEliminar.unidad || "-" },
                { label: "Estado", value: incidenciaAEliminar.estado || "-" },
              ]
            : []
        }
      />

      <SuccessModal
        isOpen={isEliminacionSuccessOpen}
        onClose={cerrarModalEliminacionSuccess}
        message="Incidencia eliminada con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default Incidencias;