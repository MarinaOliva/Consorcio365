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
}) {
  return (
    <>
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