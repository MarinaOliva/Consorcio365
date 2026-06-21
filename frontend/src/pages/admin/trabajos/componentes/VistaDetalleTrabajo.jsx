import {
  ArrowLeft,
  CircleAlert,
  ExternalLink,
} from "lucide-react";
import Button from "../../../../components/ui/Button";

import BadgeEstadoTrabajo from "./BadgeEstadoTrabajo";
import EvidenciaCardTrabajo from "./EvidenciaCardTrabajo";
import HistorialItemTrabajo from "./HistorialItemTrabajo";
import InfoTrabajoItem from "./InfoTrabajoItem";
import TarjetaDetalleTrabajo from "./TarjetaDetalleTrabajo";
import { obtenerDetalleTrabajo } from "../utils/trabajos";

function VistaDetalleTrabajo({ trabajo, onVolver }) {
  const detalle = obtenerDetalleTrabajo(trabajo);

  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <TarjetaDetalleTrabajo title="Información">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-textMain">
                {detalle.titulo}
              </h2>

              <BadgeEstadoTrabajo estado={detalle.estado} />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
                <InfoTrabajoItem label="ID" value={`#${detalle.codigoTrabajo}`} />
                <InfoTrabajoItem label="Edificio" value={detalle.edificio} />
                <InfoTrabajoItem label="Unidad" value={detalle.unidad} />
                <InfoTrabajoItem
                  label="Presupuesto"
                  value={detalle.presupuesto}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <InfoTrabajoItem label="Proveedor" value={detalle.proveedor} />
              </div>  

              <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-3">
                <InfoTrabajoItem
                  label="Fecha inicio"
                  value={detalle.fechaInicio}
                />
                <InfoTrabajoItem
                  label="Fecha finalización"
                  value={detalle.fechaFinalizacion}
                />
                <InfoTrabajoItem label="Duración" value={detalle.duracion} />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Descripción
              </p>

              <p className="mt-2 text-sm leading-relaxed text-textMain">
                {detalle.descripcion}
              </p>
            </div>
          </TarjetaDetalleTrabajo>

          <TarjetaDetalleTrabajo title="Incidencia de Origen">
            <div
              className="
                rounded-lg border border-border/70
                bg-surfaceSoft/60 px-4 py-3
              "
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <CircleAlert size={13} />
                    </span>

                    <p className="truncate text-sm font-bold text-textMain">
                      {detalle.incidenciaOrigen.titulo}
                    </p>
                  </div>

                  <p className="mt-2 pl-7 text-xs text-textMuted">
                    <span className="font-bold text-primary">
                      #{detalle.incidenciaOrigen.numero}
                    </span>
                    <span className="mx-2">•</span>
                    Creada: {detalle.incidenciaOrigen.fecha}
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    group inline-flex items-center gap-1 text-xs font-bold
                    text-primary transition-colors duration-200
                    hover:text-secondary
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30
                    focus-visible:ring-offset-2
                  "
                >
                  <span
                    className="
                      relative
                      after:absolute after:-bottom-0.5 after:left-0 after:h-[2px]
                      after:w-0 after:rounded-full after:bg-current
                      after:transition-all after:duration-200
                      group-hover:after:w-full
                    "
                  >
                    Ver incidencia
                  </span>

                  <ExternalLink
                    size={14}
                    className="
                      transition-transform duration-200
                      group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                    "
                  />
                </button>
              </div>
            </div>
          </TarjetaDetalleTrabajo>

          <TarjetaDetalleTrabajo
            title="Evidencias subidas por el proveedor"
            rightContent={
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                {detalle.evidencias.length}
              </span>
            }
          >
            <div className="flex flex-wrap gap-4">
              {detalle.evidencias.map((evidencia) => (
                <EvidenciaCardTrabajo key={evidencia.id} evidencia={evidencia} />
              ))}
            </div>
          </TarjetaDetalleTrabajo>
        </div>

        <TarjetaDetalleTrabajo title="Historial" className="lg:min-h-[520px]">
          <div className="relative space-y-5">
            <span className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-border" />

            {detalle.historial.map((item) => (
              <HistorialItemTrabajo key={item.id} item={item} />
            ))}
          </div>
        </TarjetaDetalleTrabajo>
      </div>
    </section>
  );
}

export default VistaDetalleTrabajo;