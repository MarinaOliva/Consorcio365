import { CalendarDays, Search } from "lucide-react";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function FiltrosHistorialTrabajosProveedor({
  estadoFiltro,
  setEstadoFiltro,
  fechaFiltro,
  setFechaFiltro,
  busqueda,
  setBusqueda,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <select
        value={estadoFiltro}
        onChange={(e) => setEstadoFiltro(e.target.value)}
        className={`${CLASE_CAMPO_FILTRO} lg:w-[180px]`}
      >
        <option value="Todos">Estado: Todos</option>
        <option value="Finalizado">Finalizado</option>
        <option value="Cerrado">Cerrado</option>
      </select>

      <div className="relative lg:w-[190px]">
        <CalendarDays
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
        />

        <select
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className={`${CLASE_CAMPO_FILTRO} pl-9`}
        >
          <option value="Todos">Todas las fechas</option>
          <option value="30">Últimos 30 días</option>
          <option value="60">Últimos 60 días</option>
          <option value="90">Últimos 90 días</option>
          <option value="365">Último año</option>
        </select>
      </div>

      <div className="relative lg:w-[220px]">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
        />

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          className={`${CLASE_CAMPO_FILTRO} pl-9`}
        />
      </div>
    </div>
  );
}

export default FiltrosHistorialTrabajosProveedor;