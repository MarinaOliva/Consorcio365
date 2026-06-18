import { CircleAlert } from "lucide-react";

import BadgeEstado from "./BadgeEstado";
import TarjetaDetalle from "./TarjetaDetalle";

function TarjetaHistorialIncidencias({
  incidencias = [],
  totalRegistrado = 0,
}) {
  return (
    <TarjetaDetalle title="Historial de incidencias">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-textMuted">
          Total registrado
        </span>

        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {totalRegistrado}
        </span>
      </div>

      <div className="space-y-3">
        {incidencias.map((incidencia) => (
          <div
            key={incidencia.id}
            className="
              flex items-center justify-between gap-3
              rounded-lg border border-border/70
              bg-surfaceSoft/60 px-4 py-3
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <CircleAlert
                size={17}
                className={
                  incidencia.estado === "Abierta"
                    ? "shrink-0 text-red-500"
                    : incidencia.estado === "Resuelta"
                    ? "shrink-0 text-emerald-500"
                    : "shrink-0 text-slate-500"
                }
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-textMain">
                  {incidencia.titulo}
                </p>

                <p className="text-xs text-textMuted">{incidencia.fecha}</p>
              </div>
            </div>

            <BadgeEstado estado={incidencia.estado} />
          </div>
        ))}
      </div>
    </TarjetaDetalle>
  );
}

export default TarjetaHistorialIncidencias;