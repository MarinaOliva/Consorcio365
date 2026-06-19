import { Eye, Pencil, Trash2 } from "lucide-react";
import SectionCard from "../../../../components/dashboard/SectionCard";
import { formatearMonto } from "../utils/trabajos";
import BadgeEstadoTrabajo from "./BadgeEstadoTrabajo";
import BotonIcono from "./BotonIcono";

function TablaTrabajos({
  trabajos,
  totalTrabajos,
  onVerTrabajo,
  onEditarTrabajo,
  onEliminarTrabajo,
}) {
  return (
    <SectionCard title="Listado de trabajos">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] table-fixed border-collapse text-xs">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-3 py-2 font-bold">Incidencia - Origen</th>
              <th className="px-3 py-2 font-bold">Estado</th>
              <th className="px-3 py-2 font-bold">Proveedor</th>
              <th className="px-3 py-2 font-bold">Presupuesto</th>
              <th className="px-3 py-2 font-bold">Fecha</th>
              <th className="px-3 py-2 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {trabajos.length > 0 ? (
              trabajos.map((trabajo) => (
                <tr
                  key={trabajo.id}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <td className="px-3 py-2 text-textMain">
                    <div className="flex min-w-0 items-center gap-x-1">
                      <span className="truncate">{trabajo.incidencia}</span>
                      <span className="shrink-0 text-textMuted">-</span>
                      <span className="shrink-0 font-bold text-primary">
                        {trabajo.numeroIncidencia
                          ? `#${trabajo.numeroIncidencia}`
                          : trabajo.origen}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2 text-textMain">
                    <BadgeEstadoTrabajo estado={trabajo.estado} />
                  </td>

                  <td className="px-3 py-2 text-textMain">
                    <span className="block truncate">{trabajo.proveedor}</span>
                  </td>

                  <td className="px-3 py-2 text-textMain">
                    <span className="font-medium">
                      {formatearMonto(trabajo.presupuesto)}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-textMain">
                    <span className="font-medium">{trabajo.fecha}</span>
                  </td>

                  <td className="px-3 py-2 text-textMain">
                    <div className="flex items-center justify-end gap-2">
                      <BotonIcono
                        label="Eliminar trabajo"
                        danger
                        onClick={() => onEliminarTrabajo(trabajo)}
                      >
                        <Trash2 size={15} />
                      </BotonIcono>

                      <BotonIcono
                        label="Ver trabajo"
                        onClick={() => onVerTrabajo(trabajo)}
                      >
                        <Eye size={15} />
                      </BotonIcono>

                      <BotonIcono
                        label="Editar trabajo"
                        onClick={() => onEditarTrabajo(trabajo)}
                      >
                        <Pencil size={15} />
                      </BotonIcono>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-textMain">
                    No se encontraron trabajos.
                  </p>
                  <p className="mt-1 text-xs text-textMuted">
                    Probá ajustar los filtros o realizar una nueva búsqueda.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="
          mt-3 rounded-lg border border-border/70 bg-surfaceSoft/50
          px-4 py-2
        "
      >
        <p className="text-xs font-medium text-primary">
          Mostrando {trabajos.length} de {totalTrabajos} trabajos
        </p>
      </div>
    </SectionCard>
  );
}

export default TablaTrabajos;