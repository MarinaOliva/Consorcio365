import { CalendarDays, Search } from "lucide-react";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function FiltrosIncidencias({
  edificioFiltro,
  estadoFiltro,
  unidadFiltro,
  fechaFiltro,
  busqueda,
  edificiosDisponibles,
  unidadesDisponibles,
  onCambiarEdificio,
  onCambiarEstado,
  onCambiarUnidad,
  onCambiarFecha,
  onCambiarBusqueda,
}) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={edificioFiltro}
          onChange={(e) => onCambiarEdificio(e.target.value)}
          className={`${CLASE_CAMPO_FILTRO} sm:w-[180px]`}
        >
          {edificiosDisponibles.map((edificio) => (
            <option key={edificio} value={edificio}>
              Edificio: {edificio}
            </option>
          ))}
        </select>

        <select
          value={estadoFiltro}
          onChange={(e) => onCambiarEstado(e.target.value)}
          className={`${CLASE_CAMPO_FILTRO} sm:w-[140px]`}
        >
          <option value="Todos">Estado: Todos</option>
          <option value="ABIERTA">Estado: Abierta</option>
          <option value="EN_PROGRESO">Estado: En progreso</option>
          <option value="RESUELTA">Estado: Resuelta</option>
          <option value="CERRADA">Estado: Cerrada</option>
          <option value="RECHAZADA">Estado: Rechazada</option>
          <option value="CANCELADA">Estado: Cancelada</option>
        </select>

        <select
          value={unidadFiltro}
          onChange={(e) => onCambiarUnidad(e.target.value)}
          className={`${CLASE_CAMPO_FILTRO} sm:w-[140px]`}
        >
          {unidadesDisponibles.map((unidad) => (
            <option key={unidad} value={unidad}>
              Unidad: {unidad}
            </option>
          ))}
        </select>

        <div className="relative w-full sm:w-[180px]">
          <select
            value={fechaFiltro}
            onChange={(e) => onCambiarFecha(e.target.value)}
            className={`${CLASE_CAMPO_FILTRO} pl-9`}
          >
            <option value="Todos">Todas las fechas</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>

          <CalendarDays
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
          />
        </div>

        <div className="relative w-full sm:w-[165px]">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
          />

          <input
            type="text"
            value={busqueda}
            onChange={(e) => onCambiarBusqueda(e.target.value)}
            placeholder="Buscar..."
            className={`${CLASE_CAMPO_FILTRO} pl-9`}
          />
        </div>
      </div>
    </div>
  );
}

export default FiltrosIncidencias;