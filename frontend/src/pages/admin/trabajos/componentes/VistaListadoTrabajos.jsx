import ToolbarTrabajos from "./ToolbarTrabajos";
import TablaTrabajos from "./TablaTrabajos";

function VistaListadoTrabajos({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
  proveedorFiltro,
  setProveedorFiltro,
  fechaFiltro,
  setFechaFiltro,
  proveedoresDisponibles,
  trabajos,
  totalTrabajos,
  onNuevoTrabajo,
  onVerTrabajo,
  onEditarTrabajo,
  onEliminarTrabajo,
}) {
  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <ToolbarTrabajos
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        proveedorFiltro={proveedorFiltro}
        setProveedorFiltro={setProveedorFiltro}
        fechaFiltro={fechaFiltro}
        setFechaFiltro={setFechaFiltro}
        proveedoresDisponibles={proveedoresDisponibles}
        onNuevoTrabajo={onNuevoTrabajo}
      />

      <TablaTrabajos
        trabajos={trabajos}
        totalTrabajos={totalTrabajos}
        onVerTrabajo={onVerTrabajo}
        onEditarTrabajo={onEditarTrabajo}
        onEliminarTrabajo={onEliminarTrabajo}
      />
    </section>
  );
}

export default VistaListadoTrabajos;