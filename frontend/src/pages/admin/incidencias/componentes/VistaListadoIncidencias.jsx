import FiltrosIncidencias from "./FiltrosIncidencias";
import TablaIncidencias from "./TablaIncidencias";

function VistaListadoIncidencias({
  edificioFiltro,
  estadoFiltro,
  unidadFiltro,
  fechaFiltro,
  busqueda,
  edificiosDisponibles,
  unidadesDisponibles,
  incidencias,
  totalIncidencias,
  onCambiarEdificio,
  onCambiarEstado,
  onCambiarUnidad,
  onCambiarFecha,
  onCambiarBusqueda,
  onVer,
  onEditar,
  onEliminar,
  onNuevaIncidencia,
}) {
  return (
    <>
      <div className="flex justify-end">
  	<button
    	type="button"
    	onClick={onNuevaIncidencia}
    	className="
      	inline-flex items-center gap-2 rounded-lg bg-primary
      	px-4 py-2 text-sm font-bold text-white shadow-sm
      	transition hover:bg-primaryHover
      	focus:outline-none focus:ring-2 focus:ring-primary/30
    	"
  	>
    	+ Nueva incidencia
  	</button>
	</div>
      <FiltrosIncidencias
        edificioFiltro={edificioFiltro}
        estadoFiltro={estadoFiltro}
        unidadFiltro={unidadFiltro}
        fechaFiltro={fechaFiltro}
        busqueda={busqueda}
        edificiosDisponibles={edificiosDisponibles}
        unidadesDisponibles={unidadesDisponibles}
        onCambiarEdificio={onCambiarEdificio}
        onCambiarEstado={onCambiarEstado}
        onCambiarUnidad={onCambiarUnidad}
        onCambiarFecha={onCambiarFecha}
        onCambiarBusqueda={onCambiarBusqueda}
      />

      <TablaIncidencias
        incidencias={incidencias}
        totalIncidencias={totalIncidencias}
        onVer={onVer}
        onEditar={onEditar}
        onEliminar={onEliminar}
      />
    </>
  );
}

export default VistaListadoIncidencias;