import BadgeEstado from "./BadgeEstado";
import TarjetaDetalle from "./TarjetaDetalle";

function TarjetaHistorialOcupacion({ historialOcupacion = [] }) {
  return (
    <TarjetaDetalle title="Historial de ocupación" titleAlign="center">
      <div className="overflow-x-auto rounded-lg border border-secondary/40">
        <table className="w-full min-w-[430px] border-collapse text-xs">
          <thead>
            <tr className="bg-secondary text-left text-white">
              <th className="px-3 py-3 font-bold">Ocupante</th>
              <th className="px-3 py-3 font-bold">Rol</th>
              <th className="px-3 py-3 font-bold">Desde</th>
              <th className="px-3 py-3 font-bold">Hasta</th>
              <th className="px-3 py-3 font-bold">Estado</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {historialOcupacion.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border/50 last:border-b-0"
              >
                <td className="px-3 py-3 font-semibold text-textMain">
                  {item.ocupante}
                </td>

                <td className="px-3 py-3 font-semibold text-textMain">
                  {item.rol}
                </td>

                <td className="px-3 py-3 font-semibold text-textMain">
                  {item.desde}
                </td>

                <td className="px-3 py-3 font-semibold text-textMain">
                  {item.hasta}
                </td>

                <td className="px-3 py-3">
                  <BadgeEstado estado={item.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TarjetaDetalle>
  );
}

export default TarjetaHistorialOcupacion;