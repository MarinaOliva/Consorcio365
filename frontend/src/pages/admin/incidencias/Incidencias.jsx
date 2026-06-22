import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import SuccessModal from "../../../components/shared/SuccessModal";
import ModalConfirmacion from "../../../components/shared/ModalConfirmacion";
import CrearTrabajoModal from "../../../components/admin/CrearTrabajoModal";
import AdminNuevaIncidenciaModal from "../../../components/admin/AdminNuevaIncidenciaModal"

import VistaListadoIncidencias from "./componentes/VistaListadoIncidencias";
import VistaDetalleIncidencia from "./componentes/VistaDetalleIncidencia";
import VistaEdicionIncidencia from "./componentes/VistaEdicionIncidencia";
import { useIncidenciasAdmin } from "../../../hooks/useIncidencias";

function Incidencias() {
  const {
	// Datos
	incidenciasFiltradas,
	totalIncidencias,
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

	// Crear nueva incidencia
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
  } = useIncidenciasAdmin();

  const subtitulo = incidenciaEnEdicion
	? `Editar incidencia > ID #${String(incidenciaEnEdicion.id).slice(-4)}`
	: incidenciaSeleccionada
	? `Detalle de incidencia > ID #${String(incidenciaSeleccionada.id).slice(-4)}`
	: "Gestión de reportes y reclamos";

  return (
	<ContenedorPanelPorRol titulo="Incidencias" subtitulo={subtitulo}>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	{loading && (
      	<p className="py-6 text-sm text-textMuted">Cargando incidencias...</p>
    	)}

    	{error && !loading && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-4">
        	<p className="text-sm font-semibold text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
      	<>
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
				onNuevaIncidencia={abrirModalNuevaIncidencia}
          	/>
        	)}
      	</>
    	)}
  	</section>

  	<SuccessModal
    	isOpen={isCambiosGuardadosOpen}
    	onClose={cerrarModalCambiosGuardados}
    	message="Cambios guardados con éxito"
  	/>

  	<ModalConfirmacion
    	isOpen={isConfirmarEliminacionOpen}
    	title="Confirmar cancelación"
    	message={
      	incidenciaAEliminar
        	? `¿Querés cancelar la incidencia "${incidenciaAEliminar.titulo}"?`
        	: "¿Querés cancelar esta incidencia?"
    	}
    	confirmLabel="Cancelar incidencia"
    	cancelLabel="Volver"
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
    	message="Incidencia cancelada con éxito"
  	/>

  	<CrearTrabajoModal
    	isOpen={modalCrearTrabajoAbierto}
    	onClose={cerrarModalCrearTrabajo}
    	onCreate={handleCrearTrabajoDesdeIncidencia}
    	values={trabajoDraft}
    	onChange={handleChangeTrabajoDraft}
    	proveedoresDisponibles={proveedoresActivos}
    	incidenciaPreseleccionada={incidenciaPreseleccionada}
  	/>

  	<SuccessModal
    	isOpen={modalTrabajoCreadoAbierto}
    	onClose={cerrarModalTrabajoCreado}
    	message="Trabajo creado con éxito"
  	/>
	<AdminNuevaIncidenciaModal
		isOpen={modalNuevaIncidenciaAbierto}
		onClose={cerrarModalNuevaIncidencia}
		onCreate={handleCrearNuevaIncidencia}
		values={nuevaIncidenciaDraft}
		onChange={handleChangeNuevaIncidencia}
		edificios={edificios}		
		ocupantesDisponibles={ocupantesActivos}
	/>

	<SuccessModal
		isOpen={modalIncidenciaCreadaAbierto}
		onClose={cerrarModalIncidenciaCreada}
		message="Incidencia creada con éxito"
	/>

	</ContenedorPanelPorRol>
  );
}

export default Incidencias;