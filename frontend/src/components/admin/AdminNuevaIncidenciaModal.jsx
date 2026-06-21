import { X, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

const CATEGORIAS = [
  { value: "plomeria", label: "Plomería" },
  { value: "electricidad", label: "Electricidad" },
  { value: "albanileria", label: "Albañilería" },
  { value: "ascensores", label: "Ascensores" },
  { value: "cerrajeria", label: "Cerrajería" },
  { value: "limpieza", label: "Limpieza" },
  { value: "jardineria", label: "Jardinería" },
  { value: "otro", label: "Otro" },
];

const PRIORIDADES = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

const CLASE_CAMPO = `
  h-9 w-full rounded-lg border border-slate-300 bg-white
  px-3 text-sm text-slate-800 shadow-sm
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-purple-900/40
`;

function ModalNuevaIncidenciaAdmin({
  isOpen,
  onClose,
  onCreate,
  values,
  onChange,
  edificios = [],
  ocupantesDisponibles = [],
}) {
  if (!isOpen) return null;

  const actualizarCampo = (campo, valor) => onChange?.(campo, valor);

  return (
	<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
  	<div
    	className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    	onClick={onClose}
    	aria-hidden="true"
  	/>

  	<div
    	role="dialog"
    	aria-modal="true"
    	className="relative z-10 flex max-h-[90dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-white/40 bg-[#cfd8dc] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
  	>
    	<div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
      	<h2 className="text-base font-bold">Nueva incidencia</h2>
      	<button
        	type="button"
        	onClick={onClose}
        	aria-label="Cerrar"
        	className="rounded-md p-1 transition hover:bg-white/15"
      	>
        	<X size={20} />
      	</button>
    	</div>

    	<div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
      	{/* Edificio */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Edificio <span className="text-primary">*</span>
        	</label>
        	<div className="relative">
          	<select
            	value={values?.edificioId || ""}
            	onChange={(e) => actualizarCampo("edificioId", e.target.value)}
            	className={`${CLASE_CAMPO} appearance-none pr-9`}
          	>
            	<option value="">Seleccione un edificio</option>
            	{edificios.map((e) => (
              	<option key={e._id} value={e._id}>
                	{e.nombre}
              	</option>
            	))}
          	</select>
          	<ChevronDown
            	size={18}
            	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          	/>
        	</div>
      	</div>

      	{/* Ocupante reportante */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Ocupante que reporta <span className="text-primary">*</span>
        	</label>
        	<div className="relative">
          	<select
            	value={values?.ocupanteId || ""}
            	onChange={(e) => actualizarCampo("ocupanteId", e.target.value)}
            	className={`${CLASE_CAMPO} appearance-none pr-9`}
          	>
            	<option value="">Seleccione un ocupante</option>
            	{ocupantesDisponibles.map((o) => (
              	<option key={o._id} value={o._id}>
                	{o.nombre} {o.apellido} — {o.email}
              	</option>
            	))}
          	</select>
          	<ChevronDown
            	size={18}
            	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          	/>
        	</div>
        	{ocupantesDisponibles.length === 0 && (
          	<p className="text-xs text-textMuted">
            	No hay ocupantes activos disponibles.
          	</p>
        	)}
      	</div>

      	{/* Título */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Título <span className="text-primary">*</span>
        	</label>
        	<input
          	type="text"
          	value={values?.titulo ?? ""}
          	onChange={(e) => actualizarCampo("titulo", e.target.value)}
          	placeholder="Ej: Pérdida de agua en cocina"
          	className={CLASE_CAMPO}
        	/>
      	</div>

      	{/* Descripción */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Descripción <span className="text-primary">*</span>
        	</label>
        	<textarea
          	value={values?.descripcion ?? ""}
          	onChange={(e) => actualizarCampo("descripcion", e.target.value)}
          	placeholder="Describí el problema"
          	rows={3}
          	className={`${CLASE_CAMPO} h-auto resize-none py-3`}
        	/>
      	</div>

      	{/* Categoría y prioridad */}
      	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        	<div className="space-y-2">
          	<label className="text-sm font-medium text-slate-700">
            	Categoría <span className="text-primary">*</span>
          	</label>
          	<div className="relative">
            	<select
              	value={values?.categoria || ""}
              	onChange={(e) => actualizarCampo("categoria", e.target.value)}
              	className={`${CLASE_CAMPO} appearance-none pr-9`}
            	>
              	<option value="">Seleccione una categoría</option>
              	{CATEGORIAS.map((c) => (
                	<option key={c.value} value={c.value}>
                  	{c.label}
                	</option>
              	))}
            	</select>
            	<ChevronDown
              	size={18}
              	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            	/>
          	</div>
        	</div>

        	<div className="space-y-2">
          	<label className="text-sm font-medium text-slate-700">
            	Prioridad
          	</label>
          	<div className="relative">
            	<select
              	value={values?.prioridad || "media"}
              	onChange={(e) => actualizarCampo("prioridad", e.target.value)}
              	className={`${CLASE_CAMPO} appearance-none pr-9`}
            	>
              	{PRIORIDADES.map((p) => (
                	<option key={p.value} value={p.value}>
                  	{p.label}
                	</option>
              	))}
            	</select>
            	<ChevronDown
              	size={18}
              	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
            	/>
          	</div>
        	</div>
      	</div>

      	{/* Espacio */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Espacio / Ubicación (opcional)
        	</label>
        	<input
          	type="text"
          	value={values?.espacio ?? ""}
          	onChange={(e) => actualizarCampo("espacio", e.target.value)}
          	placeholder="Ej: Unidad 1A, Pasillo piso 2, SUM"
          	className={CLASE_CAMPO}
        	/>
      	</div>
    	</div>

    	<div className="flex flex-wrap justify-center gap-5 border-t border-border px-6 py-5">
      	<Button variant="elevated" size="md" type="button" onClick={onCreate}>
        	Crear
      	</Button>
      	<Button variant="neutral" size="md" type="button" onClick={onClose}>
        	Cancelar
      	</Button>
    	</div>
  	</div>
	</div>
  );
}

export default ModalNuevaIncidenciaAdmin;

