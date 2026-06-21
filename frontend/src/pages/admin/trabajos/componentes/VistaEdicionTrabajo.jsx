import {
  ArrowLeft,
  CircleAlert,
  ExternalLink,
} from "lucide-react";
import Button from "../../../../components/ui/Button";

import EstadoTrabajoSelect from "./EstadoTrabajoSelect";
import EvidenciaCardTrabajo from "./EvidenciaCardTrabajo";
import HistorialItemTrabajo from "./HistorialItemTrabajo";
import InfoTrabajoItem from "./InfoTrabajoItem";
import TarjetaDetalleTrabajo from "./TarjetaDetalleTrabajo";
import { obtenerDetalleTrabajo } from "../utils/trabajos";

function VistaEdicionTrabajo({
  trabajo,
  estadoEditable,
  onEstadoChange,
  onMontoChange,
  onProveedorChange,
  proveedoresDisponibles = [],
  onVolver,
  onGuardar,
}) {
  const detalle = obtenerDetalleTrabajo({
    ...trabajo,
    estado: estadoEditable,
    presupuesto: trabajo.presupuesto,
  });

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

        <Button
          variant="elevated"
          size="sm"
          type="button"
          className="gap-2"
          onClick={onGuardar}
        >
          Guardar cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <TarjetaDetalleTrabajo title="Información">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-textMain">
                {detalle.titulo}
              </h2>

              <EstadoTrabajoSelect
                value={estadoEditable}
                onChange={onEstadoChange}
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
                <InfoTrabajoItem label="ID" value={`#${detalle.codigoTrabajo}`} />
                <InfoTrabajoItem label="Edificio" value={detalle.edificio} />
                <InfoTrabajoItem label="Unidad" value={detalle.unidad} />
                <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-textMuted">
                Presupuesto
                </p>
                <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-textMain">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={trabajo.presupuesto ?? 0}
                  onChange={(e) => onMontoChange?.(Number(e.target.value))}
                  className="
                    w-28 rounded-md border border-slate-300 bg-white px-2 py-1
                    text-sm font-bold text-textMain
                    outline-none transition
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                  "
                />
                </div>
              </div>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
              <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Proveedor
              </p>
              <select
                value={trabajo.proveedorId || ""}
                onChange={(e) => onProveedorChange?.(e.target.value)}
                className="
                  w-full rounded-md border border-slate-300 bg-white px-2 py-1
                  text-sm font-bold text-textMain
                  outline-none transition
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                "
              >
                <option value="">Sin proveedor asignado</option>
                {proveedoresDisponibles.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre} {p.apellido}
                    {p.proveedorDetalle?.especialidad
                      ? ` — ${p.proveedorDetalle.especialidad}`
                      : ""}
                  </option>
                ))}
              </select>
              </div>
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

          <TarjetaDetalleTrabajo
            title={
            detalle.incidenciaOrigen.tipo === "mantenimiento"
              ? "Plan de Mantenimiento de Origen"
              : "Incidencia de Origen"
            }
          >

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
                onClick={() => {
                if (!detalle.incidenciaOrigen.idDestino) return;
                if (detalle.incidenciaOrigen.tipo === "mantenimiento") {
                  window.location.href = `/admin/mantenimiento/${detalle.incidenciaOrigen.idDestino}`;
                } else {
                  window.location.href = `/admin/incidencias/${detalle.incidenciaOrigen.idDestino}`;
                }
                }}
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
                {detalle.incidenciaOrigen.tipo === "mantenimiento"
                  ? "Ver plan"
                  : "Ver incidencia"}
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

export default VistaEdicionTrabajo;