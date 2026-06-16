import StatCard from "../../../../components/dashboard/StatCard";

function GridEstadisticasMantenimiento({ estadisticas = [] }) {
  return (
    <div
      className="
        mx-auto grid max-w-[1020px] grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3 lg:justify-items-center
      "
    >
      {estadisticas.map((item) => (
        <div key={item.id} className="w-full lg:max-w-[320px]">
          <StatCard
            title={item.titulo}
            value={item.valor}
            icon={item.icono}
          />
        </div>
      ))}
    </div>
  );
}

export default GridEstadisticasMantenimiento;