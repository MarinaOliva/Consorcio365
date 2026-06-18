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

              <div className="max-w-[140px]">
                <label className="text-[11px] font-semibold text-textMuted">
                  Estado
                </label>

                <select
                  value={etiquetaEstadoUnidad(unidad.estado)}
                  onChange={(e) => onActualizarCampo("estado", e.target.value)}
                  className="
                    mt-0 w-full rounded-lg border border-border bg-white
                    px-1 py-0 text-sm font-bold text-textMain
                    outline-none transition
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                  "
                >
                  <option value="Ocupada">Ocupada</option>
                  <option value="Desocupada">Desocupada</option>
                </select>
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
            <Button
              variant="elevated"
              size="md"
              type="button"
              onClick={onGuardar}
            >
              Guardar cambios
            </Button>

            <Button
              variant="neutral"
              size="md"
              type="button"
              onClick={onCancelar}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VistaEdicionUnidad;