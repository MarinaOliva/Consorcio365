import { Clock, UserCircle } from "lucide-react";
import TarjetaDetalleIncidencia from "./TarjetaDetalleIncidencia";
import { obtenerColorHistorial } from "../utils/incidencias";

function HistorialIncidencia({ historial = [] }) {
  return (
    <TarjetaDetalleIncidencia title="Historial" className="lg:min-h-[520px]">
      <div className="relative space-y-5">
        <span className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-border" />

        {historial.map((item) => (
          <div key={item.id} className="relative flex gap-3">
            <span
              className={`
                relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full
                border-2 border-white
                ${obtenerColorHistorial(item.tipo)}
              `}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-textMain">{item.titulo}</p>

                <span className="shrink-0 text-[11px] font-semibold text-textMuted">
                  {item.fecha}
                </span>
              </div>

              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                <Clock size={12} />
                {item.hora}
              </p>

              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                <UserCircle size={12} />
                {item.usuario}
              </p>

              <p className="mt-2 text-xs leading-relaxed text-textMain">
                {item.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </TarjetaDetalleIncidencia>
  );
}

export default HistorialIncidencia;