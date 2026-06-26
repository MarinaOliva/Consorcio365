import { ArrowLeft } from "lucide-react";

import Button from "../../../../components/ui/Button";

import BadgeEstado from "./BadgeEstado";
import InfoBasicaItem from "./InfoBasicaItem";
import TarjetaDetalle from "./TarjetaDetalle";
import TarjetaHistorialIncidencias from "./TarjetaHistorialIncidencias";
import TarjetaHistorialOcupacion from "./TarjetaHistorialOcupacion";
import TarjetaRelacionUsuarios from "./TarjetaRelacionUsuarios";
import {
  construirHistorialOcupacion,
  construirIncidencias,
  construirUsuariosRelacionados,
} from "../utils/construirContenidoUnidad";
import { etiquetaEstadoUnidad } from "../utils/normalizarEstadoUnidad";

function VistaEdicionUnidad({
  unidad,
  onVolver,
  onActualizarCampo,
  onActualizarRelacionUsuario,
  onFinalizarRelacionUsuario,
  onGuardar,
  onCancelar,
}) {
  const usuariosRelacionados = construirUsuariosRelacionados(unidad, {
	editable: true,
  });
  const incidencias = construirIncidencias(unidad);
  const historialOcupacion = construirHistorialOcupacion(unidad);

  const estadoActual = unidad.estado;
  const esOcupada = estadoActual === "Ocupada";
  const esEnRefaccion = estadoActual === "En refacción";

  return (
	<>
  	<Button
    	variant="ghost"
    	size="sm"
    	type="button"
    	onClick={onVolver}
    	className="gap-2"
  	>
    	<ArrowLeft size={16} />
    	Volver
  	</Button>

  	<div className="overflow-hidden rounded-xl border border-secondary/70 bg-white shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
    	<div className="flex flex-wrap items-center justify-center gap-3 bg-secondary px-6 py-4 text-white">
      	<h2 className="text-base font-bold">Editar Unidad {unidad.numero}</h2>

      	<BadgeEstado estado={unidad.estado} />
    	</div>

    	<div className="space-y-5 bg-surfaceSoft p-5 md:p-6">
      	<TarjetaDetalle title="Información básica">
        	<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          	<InfoBasicaItem label="Número" value={unidad.numero} />
          	<InfoBasicaItem label="Piso" value={unidad.piso} />
          	<InfoBasicaItem label="Edificio" value={unidad.edificio} />
          	<InfoBasicaItem label="Superficie" value={unidad.superficie} />

          	<div className="col-span-2 md:col-span-1">
            	<label className="text-[11px] font-semibold text-textMuted">
              	Estado
            	</label>

            	<div className="mt-1 text-sm font-bold text-textMain">
              	{etiquetaEstadoUnidad(estadoActual)}
            	</div>
          	</div>
        	</div>
      	</TarjetaDetalle>

      	<TarjetaRelacionUsuarios
        	usuarios={usuariosRelacionados}
        	editable
        	onActualizarRelacionUsuario={onActualizarRelacionUsuario}
        	onFinalizarRelacionUsuario={onFinalizarRelacionUsuario}
      	/>

      	<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        	<TarjetaHistorialIncidencias
          	incidencias={incidencias}
          	totalRegistrado={unidad.incidencias.length}
        	/>

        	<TarjetaHistorialOcupacion
          	historialOcupacion={historialOcupacion}
        	/>
      	</div>

      	<div className="flex flex-wrap justify-center gap-4 border-t border-border/70 pt-5">
          <Button variant="elevated" onClick={onGuardar}>Guardar cambios</Button>
          <Button variant="neutral" onClick={onCancelar}>Cancelar</Button>
            {!esOcupada && (
          <Button
            variant="elevated"
            size="md"
            type="button"
            onClick={() =>
              onActualizarCampo(
                "estado",
                esEnRefaccion ? "Desocupada" : "En refacción"
              )
            }
          >
            {esEnRefaccion ? "Quitar de refacción" : "Marcar en refacción"}
          </Button>
          )}
        </div>

        </div>
    	</div>
	</>
  );
}

export default VistaEdicionUnidad;

