import { CalendarDays, Eye } from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../dashboard/StatusBadge";

function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

function TablaHistorialTrabajosProveedor({
  trabajos = [],
  totalTrabajos = 0,
  onVerDetalle = () => {},
}) {
  return (
    <Card className="border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] table-fixed border-collapse text-xs">
          <colgroup>
            <col className="w-[38%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-3 py-3 font-bold">Trabajo</th>
              <th className="px-3 py-3 font-bold">Estado</th>
              <th className="px-3 py-3 font-bold">Presupuesto</th>
              <th className="px-3 py-3 font-bold">Fecha</th>
              <th className="px-3 py-3 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {trabajos.length > 0 ? (
              trabajos.map((trabajo) => (
                <tr
                  key={trabajo.id}
                  className="border-b border-border/60 last:border-b-0 hover:bg-primarySoft/20"
                >
                  <td className="px-3 py-4 text-textMain">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {trabajo.titulo || trabajo.incidencia}
                      </p>

                      <p className="mt-1 text-[11px] text-textMuted">
                        {trabajo.ubicacion || trabajo.edificio || "Sin ubicación"}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-4">
                    <StatusBadge status={trabajo.estado} />
                  </td>

                  <td className="px-3 py-4 text-textMain">
                    <span className="font-semibold">
                      {formatearMonto(trabajo.monto || trabajo.presupuesto)}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-textMain">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={13} className="text-textMuted" />
                      {trabajo.fechaFinalizacion || trabajo.fecha || "-"}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(trabajo)}
                      className="
                        rounded-md p-2 text-primary transition
                        hover:bg-primarySoft hover:text-primaryHover
                      "
                      aria-label={`Ver detalle del trabajo ${trabajo.titulo || trabajo.incidencia}`}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-textMain">
                    No se encontraron trabajos.
                  </p>
                  <p className="mt-1 text-xs text-textMuted">
                    Probá ajustar los filtros seleccionados.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contador dentro del bloque de la tabla */}
      <div className="mt-4 rounded-lg border border-border/70 bg-surfaceSoft/50 px-4 py-3">
        <p className="text-xs font-medium text-primary">
          Mostrando {trabajos.length} de {totalTrabajos} trabajos
        </p>
      </div>
    </Card>
  );
}

export default TablaHistorialTrabajosProveedor;