import { CalendarDays, Plus, Search } from "lucide-react";
import Button from "../../../../components/ui/Button";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function FiltrosAvisosAdmin({
  busqueda,
  setBusqueda,
  fechaFiltro,
  setFechaFiltro,
  onNuevoAviso,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
          />

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar avisos..."
            className={`${CLASE_CAMPO_FILTRO} pl-9`}
          />
        </div>

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
            <option value="90">Últimos 90 días</option>
            <option value="365">Este año</option>
          </select>
        </div>
      </div>

      <Button
        variant="elevated"
        size="md"
        onClick={onNuevoAviso}
        className="w-full gap-2 lg:w-auto"
      >
        <Plus size={16} />
        Nuevo aviso
      </Button>
    </div>
  );
}

export default FiltrosAvisosAdmin;