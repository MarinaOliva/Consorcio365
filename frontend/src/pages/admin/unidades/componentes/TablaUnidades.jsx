import { Eye, Pencil } from "lucide-react";

import SectionCard from "../../../../components/dashboard/SectionCard";
import BadgeEstado from "./BadgeEstado";
import BotonIcono from "./BotonIcono";

function TablaUnidades({
  unidades,
  totalUnidades,
  onVerDetalle,
  onEditar,
}) {
  return (
    <SectionCard title="Lista de unidades">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-xs">
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[22%]" />
            <col className="w-[20%]" />
            <col className="w-[10%]" />
          </colgroup>

          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-1 py-2 font-bold">Número</th>
              <th className="px-1 py-2 font-bold">Piso</th>
              <th className="px-2 py-2 font-bold">Edificio</th>
              <th className="px-2 py-2 font-bold">Estado</th>
              <th className="px-2 py-2 font-bold">Ocupante actual</th>
              <th className="px-2 py-2 font-bold">Propietario</th>
              <th className="px-0 py-2 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {unidades.map((unidad) => (
              <tr
                key={unidad.id}
                className="border-b border-border/50 last:border-b-0 hover:bg-primarySoft/30"
              >
                <td className="px-2 py-3 font-bold text-textMain">
                  {unidad.numero}
                </td>

                <td className="px-1 py-3 text-textMain">{unidad.piso}</td>

                <td className="px-2 py-3 text-textMain">{unidad.edificio}</td>

                <td className="px-2 py-3">
                  <BadgeEstado estado={unidad.estado} />
                </td>

                <td className="px-2 py-3 text-textMain">
                  <div className="truncate">{unidad.ocupanteActual}</div>
                </td>

                <td className="px-2 py-3 text-textMain">
                  <div className="truncate">{unidad.propietario}</div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <BotonIcono
                      onClick={() => onVerDetalle(unidad)}
                      label={`Ver detalle de unidad ${unidad.numero}`}
                    >
                      <Eye size={16} />
                    </BotonIcono>

                    <BotonIcono
                      onClick={() => onEditar(unidad)}
                      label={`Editar unidad ${unidad.numero}`}
                    >
                      <Pencil size={16} />
                    </BotonIcono>
                  </div>
                </td>
              </tr>
            ))}

            {unidades.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-textMuted"
                >
                  No se encontraron unidades con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-border/70 bg-surfaceSoft/50 px-4 py-3 text-xs font-semibold text-primary">
        Mostrando {unidades.length} de {totalUnidades} unidades
      </div>
    </SectionCard>
  );
}

export default TablaUnidades;