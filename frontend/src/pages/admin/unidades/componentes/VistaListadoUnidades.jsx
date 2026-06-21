import FiltrosUnidades from "./FiltrosUnidades";
import TablaUnidades from "./TablaUnidades";

function VistaListadoUnidades({
  estadoFiltro,
  busqueda,
  unidades,
  totalUnidades,
  onCambiarEstado,
  onCambiarBusqueda,
  onVerDetalle,
  onEditar,
}) {
  return (
    <>
      <FiltrosUnidades
        estadoFiltro={estadoFiltro}
        busqueda={busqueda}
        onCambiarEstado={onCambiarEstado}
        onCambiarBusqueda={onCambiarBusqueda}
      />

      <TablaUnidades
        unidades={unidades}
        totalUnidades={totalUnidades}
        onVerDetalle={onVerDetalle}
        onEditar={onEditar}
      />
    </>
  );
}

export default VistaListadoUnidades;