import { opcionesEstadoUnidad } from "../utils/filtrarUnidades";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function FiltrosUnidades({
  estadoFiltro,
  busqueda,
  onCambiarEstado,
  onCambiarBusqueda,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <select
          value={estadoFiltro}
          onChange={(e) => onCambiarEstado(e.target.value)}
          className={`${CLASE_CAMPO_FILTRO} sm:w-[180px]`}
        >
          {opcionesEstadoUnidad().map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
          placeholder="Buscar por número..."
          className={`${CLASE_CAMPO_FILTRO} sm:w-[240px]`}
        />
      </div>
    </div>
  );
}

export default FiltrosUnidades;