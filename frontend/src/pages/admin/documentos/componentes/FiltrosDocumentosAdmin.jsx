import { Search, Upload } from "lucide-react";
import Button from "../../../../components/ui/Button";

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function FiltrosDocumentosAdmin({
  busqueda,
  setBusqueda,
  tipoFiltro,
  setTipoFiltro,
  tiposDisponibles = [],
  onSubirDocumento,
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
                    placeholder="Buscar por título, código o número..."
                    className={`${CLASE_CAMPO_FILTRO} pl-9`}
                />
            </div>

            <div>
                <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className={CLASE_CAMPO_FILTRO}
                >
                    <option value="Todos">Tipo: Todos</option>
                    {tiposDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                        {tipo}
                    </option>
                    ))}
                </select>
            </div>
       </div>

      <Button
        variant="elevated"
        size="md"
        onClick={onSubirDocumento}
        className="w-full gap-2 lg:w-auto"
      >
        <Upload size={16} />
        Subir documento
      </Button>
    </div>
  );
}

export default FiltrosDocumentosAdmin;