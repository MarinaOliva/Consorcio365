import FiltrosIncidencias from "./FiltrosIncidencias";
import TablaIncidencias from "./TablaIncidencias";
import { Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";


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
  	<Button
    	type="button"
      variant= "elevated"
    	onClick={onNuevaIncidencia}
    	
  	>
      <Plus size={16} className="mr-1.5" />
    	Nueva incidencia
  	</Button>
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