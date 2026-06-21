import { CalendarDays, UserCircle, Wrench } from "lucide-react";
import BadgeEstadoTrabajo from "./BadgeEstadoTrabajo";
import TarjetaDetalleIncidencia from "./TarjetaDetalleIncidencia";

function BloqueTrabajosAsociados({ trabajos = [] }) {
  return (
    <TarjetaDetalleIncidencia
      title="Trabajos Asociados"
      rightContent={
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
          {trabajos.length}
        </span>
      }
    >
      <div className="space-y-3">
        {trabajos.length === 0 && (
         <p className="text-sm text-textMuted">
          Esta incidencia no tiene trabajos asociados todavía.
        </p>
        )}
        {trabajos.map((trabajo) => (

          <div
            key={trabajo.id}
            className="
              rounded-lg border border-border/70
              bg-surfaceSoft/60 px-4 py-3
            "
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Wrench size={15} className="shrink-0 text-primary" />

                  <p className="truncate text-sm font-bold text-textMain">
                    {trabajo.titulo}
                  </p>
                </div>

                <div className="mt-2 space-y-1 pl-6 text-xs text-textMuted">
                  <p className="flex items-center gap-1.5">
                    <UserCircle size={12} />
                    {trabajo.proveedor}
                  </p>

                  <p className="flex items-center gap-1.5">
                    <CalendarDays size={12} />
                    Programado: {trabajo.fechaProgramada}
                  </p>
                </div>
              </div>

              <BadgeEstadoTrabajo estado={trabajo.estado} />
            </div>
          </div>
        ))}
      </div>
    </TarjetaDetalleIncidencia>
  );
}

export default BloqueTrabajosAsociados;