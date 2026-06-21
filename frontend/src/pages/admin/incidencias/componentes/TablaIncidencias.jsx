import SectionCard from "../../../../components/dashboard/SectionCard";
import { Eye, Pencil, Trash2 } from "lucide-react";

import BadgeEstadoIncidencia from "./BadgeEstadoIncidencia";
import BotonIcono from "./BotonIcono";

function TablaIncidencias({
  incidencias,
  totalIncidencias,
  onVer,
  onEditar,
  onEliminar,
}) {
  return (
    <SectionCard title="Lista de incidencias">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-xs">
          <colgroup>
            <col className="w-[7%]" />
            <col className="w-[15%]" />
            <col className="w-[11%]" />
            <col className="w-[8%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-2 py-2 font-bold">ID</th>
              <th className="px-2 py-2 font-bold">Título</th>
              <th className="px-2 py-2 font-bold">Edificio</th>
              <th className="px-2 py-2 font-bold">Unidad</th>
              <th className="px-2 py-2 font-bold">Creado por</th>
              <th className="px-2 py-2 font-bold">Categoría</th>
              <th className="px-2 py-2 font-bold">Estado</th>
              <th className="px-2 py-2 font-bold">Fecha creación</th>
              <th className="px-2 py-2 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {incidencias.map((incidencia) => (
              <tr
                key={incidencia.id}
                className="border-b border-border/50 last:border-b-0 hover:bg-primarySoft/30"
              >
                <td className="px-2 py-3 font-bold text-textMuted">
                  #{incidencia.id.slice(-4)}
                </td>

                <td className="px-2 py-3 text-textMain">
                  <div className="truncate font-semibold">
                    {incidencia.titulo}
                  </div>
                </td>

                <td className="px-1 py-3 text-textMain">
                  {incidencia.edificio}
                </td>

                <td className="px-1 py-3 truncate text-textMain">
                  {incidencia.unidad}
                </td>

                <td className="px-2 py-3 text-textMain">
                  <div className="truncate">{incidencia.creadoPor}</div>
                </td>

                <td className="px-2 py-3 text-textMain">
                  <div className="truncate">{incidencia.categoria}</div>
                </td>

                <td className="px-1 py-3">
                  <div className="inline-flex items-center justify-center">
                    <BadgeEstadoIncidencia estado={incidencia.estado} />
                  </div>
                </td>

                <td className="px-0.5 py-3 truncate text-textMain">
                  {incidencia.fechaCreacion}
                </td>

                <td className="px-1 py-3">
                  <div className="flex min-w-[76px] items-center justify-center gap-0.5">
                    <BotonIcono
                      onClick={() => onEliminar(incidencia)}
                      label={`Eliminar incidencia ${incidencia.id}`}
                      danger
                    >
                      <Trash2 size={15} />
                    </BotonIcono>

                    <BotonIcono
                      onClick={() => onVer(incidencia)}
                      label={`Ver incidencia ${incidencia.id}`}
                    >
                      <Eye size={15} />
                    </BotonIcono>

                    <BotonIcono
                      onClick={() => onEditar(incidencia)}
                      label={`Editar incidencia ${incidencia.id}`}
                    >
                      <Pencil size={15} />
                    </BotonIcono>
                  </div>
                </td>
              </tr>
            ))}

            {incidencias.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-textMuted"
                >
                  No se encontraron incidencias con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-border/70 bg-surfaceSoft/50 px-4 py-3 text-xs font-semibold text-primary">
        Mostrando {incidencias.length} de {totalIncidencias} incidencias
      </div>
    </SectionCard>
  );
}

export default TablaIncidencias;