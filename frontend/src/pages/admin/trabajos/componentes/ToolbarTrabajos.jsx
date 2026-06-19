import { CalendarDays, Plus, Search } from "lucide-react";
import Button from "../../../../components/ui/Button";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function ToolbarTrabajos({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
  proveedorFiltro,
  setProveedorFiltro,
  fechaFiltro,
  setFechaFiltro,
  proveedoresDisponibles,
  onNuevoTrabajo,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[140px_170px_170px_1fr]">
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className={CLASE_CAMPO_FILTRO}
        >
          <option value="Todos">Estado: Todos</option>
          <option value="Asignado">Asignado</option>
          <option value="En progreso">En progreso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <select
          value={proveedorFiltro}
          onChange={(e) => setProveedorFiltro(e.target.value)}
          className={CLASE_CAMPO_FILTRO}
        >
          <option value="Todos">Proveedor</option>
          {proveedoresDisponibles.map((proveedor) => (
            <option key={proveedor} value={proveedor}>
              {proveedor}
            </option>
          ))}
        </select>

        <div className="relative">
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
          </select>
        </div>

        <div className="relative">
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

      <Button
        variant="elevated"
        size="md"
        onClick={onNuevoTrabajo}
        className="w-full gap-2 lg:w-auto"
      >
        <Plus size={16} />
        Crear trabajo
      </Button>
    </div>
  );
}

export default ToolbarTrabajos;