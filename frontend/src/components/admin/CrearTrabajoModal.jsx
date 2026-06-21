import { X, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

function CampoTexto({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
	<div className="space-y-2">
  	<label className="text-sm font-medium text-slate-700">
    	{label}
    	{required && <span className="text-primary"> *</span>}
  	</label>

  	<input
    	type={type}
    	value={value}
    	onChange={(e) => onChange?.(e.target.value)}
    	placeholder={placeholder}
    	className="
      	h-9 w-full rounded-lg border border-slate-300 bg-white
      	px-3 text-sm text-slate-800 shadow-sm
      	outline-none transition
      	placeholder:text-textMuted
      	focus:border-primary focus:ring-2 focus:ring-purple-900/40
    	"
  	/>
	</div>
  );
}

function CampoArea({ label, value, onChange, placeholder, required = false }) {
  return (
	<div className="space-y-2">
  	<label className="text-sm font-medium text-slate-700">
    	{label}
    	{required && <span className="text-primary"> *</span>}
  	</label>

  	<textarea
    	value={value}
    	onChange={(e) => onChange?.(e.target.value)}
    	placeholder={placeholder}
    	rows={3}
    	className="
      	w-full resize-none rounded-lg border border-slate-300 bg-white
      	px-4 py-3 text-sm text-slate-800 shadow-sm
      	outline-none transition
      	placeholder:text-textMuted
      	focus:border-primary focus:ring-2 focus:ring-purple-900/40
    	"
  	/>
	</div>
  );
}

function CrearTrabajoModal({
  isOpen,
  onClose,
  onCreate,
  values,
  onChange,
  incidenciasDisponibles = [],
  proveedoresDisponibles = [],
}) {
  if (!isOpen) return null;

  const actualizarCampo = (campo, valor) => {
	onChange?.(campo, valor);
  };

  const handleCreate = () => {
	onCreate?.();
  };

  // Datos de la incidencia seleccionada (para mostrar como referencia)
  const incidenciaSeleccionada = incidenciasDisponibles.find(
	(i) => i._id === values?.incidenciaId
  );

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
    	aria-labelledby="crear-trabajo-title"
    	className="
      	relative z-10 flex max-h-[90dvh] w-full max-w-[640px]
      	flex-col overflow-hidden rounded-2xl border border-white/40
      	bg-[#cfd8dc]
      	shadow-[0_20px_60px_rgba(0,0,0,0.35)]
    	"
  	>
    	{/* Header */}
    	<div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
      	<h2 id="crear-trabajo-title" className="text-base font-bold">
        	Crear trabajo
      	</h2>

      	<button
        	type="button"
        	onClick={onClose}
        	aria-label="Cerrar"
        	className="rounded-md p-1 transition hover:bg-white/15"
      	>
        	<X size={20} />
      	</button>
    	</div>

    	{/* Body */}
    	<div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
      	{/* Selector de incidencia */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Incidencia <span className="text-primary">*</span>
        	</label>

        	<div className="relative">
          	<select
            	value={values?.incidenciaId || ""}
            	onChange={(e) =>
              	actualizarCampo("incidenciaId", e.target.value)
            	}
            	className="
              	h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white
              	px-3 pr-9 text-sm text-slate-800 shadow-sm
              	outline-none transition
              	focus:border-primary focus:ring-2 focus:ring-purple-900/40
            	"
          	>
            	<option value="">Seleccione una incidencia activa</option>
            	{incidenciasDisponibles.map((inc) => (
              	<option key={inc._id} value={inc._id}>
                	#{inc._id.slice(-4)} — {inc.titulo} ({inc.estado})
              	</option>
            	))}
          	</select>

          	<ChevronDown
            	size={18}
            	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          	/>
        	</div>

        	{incidenciasDisponibles.length === 0 && (
          	<p className="text-xs text-textMuted">
            	No hay incidencias activas (ABIERTAS o EN_PROGRESO) disponibles.
          	</p>
        	)}
      	</div>

      	{/* Datos de la incidencia seleccionada (solo lectura) */}
      	{incidenciaSeleccionada && (
        	<div className="rounded-lg border border-secondary bg-white/70 px-4 py-3">
          	<h3 className="mb-2 text-sm font-bold text-primary">
            	Datos de la incidencia
          	</h3>
          	<div className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
            	<p>
              	<span className="font-semibold text-textMuted">
                	Categoría:
              	</span>{" "}
              	<span className="font-bold text-textMain">
                	{incidenciaSeleccionada.categoria || "-"}
              	</span>
            	</p>
            	<p>
              	<span className="font-semibold text-textMuted">Estado:</span>{" "}
              	<span className="font-bold text-textMain">
                	{incidenciaSeleccionada.estado}
              	</span>
            	</p>
            	<p>
              	<span className="font-semibold text-textMuted">
                	Prioridad:
              	</span>{" "}
              	<span className="font-bold text-textMain">
                	{incidenciaSeleccionada.prioridad || "-"}
              	</span>
            	</p>
            	<p>
              	<span className="font-semibold text-textMuted">Espacio:</span>{" "}
              	<span className="font-bold text-textMain">
                	{incidenciaSeleccionada.espacio || "-"}
              	</span>
            	</p>
          	</div>
        	</div>
      	)}

      	{/* Descripción del trabajo */}
      	<CampoArea
        	label="Descripción del trabajo"
        	value={values?.descripcion ?? ""}
        	onChange={(valor) => actualizarCampo("descripcion", valor)}
        	placeholder="Describí las tareas a realizar"
        	required
      	/>

      	{/* Selector de proveedor (opcional) */}
      	<div className="space-y-2">
        	<label className="text-sm font-medium text-slate-700">
          	Proveedor (opcional)
        	</label>

        	<div className="relative">
          	<select
            	value={values?.proveedorId || ""}
            	onChange={(e) =>
              	actualizarCampo("proveedorId", e.target.value)
            	}
            	className="
              	h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white
              	px-3 pr-9 text-sm text-slate-800 shadow-sm
              	outline-none transition
              	focus:border-primary focus:ring-2 focus:ring-purple-900/40
            	"
          	>
            	<option value="">Sin proveedor asignado</option>
            	{proveedoresDisponibles.map((p) => (
              	<option key={p._id} value={p._id}>
                	{p.nombre} {p.apellido}
                	{p.proveedorDetalle?.especialidad
                  	? ` — ${p.proveedorDetalle.especialidad}`
                  	: ""}
              	</option>
            	))}
          	</select>

          	<ChevronDown
            	size={18}
            	className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          	/>
        	</div>

        	<p className="text-xs text-textMuted">
          	Si asignás un proveedor, el trabajo nace en estado{" "}
          	<strong>ASIGNADO</strong>. Si no, en estado <strong>CREADO</strong>
          	.
        	</p>
      	</div>

      	{/* Monto / Presupuesto */}
      	<CampoTexto
        	label="Presupuesto"
        	type="number"
        	value={values?.monto ?? 0}
        	onChange={(valor) => actualizarCampo("monto", valor)}
        	placeholder="Ej: 25000"
      	/>
    	</div>

    	{/* Footer */}
    	<div className="flex flex-wrap justify-center gap-5 border-t border-border px-6 py-5">
      	<Button
        	variant="elevated"
        	size="md"
        	type="button"
        	onClick={handleCreate}
      	>
        	Crear
      	</Button>

      	<Button
        	variant="neutral"
        	size="md"
        	type="button"
        	onClick={onClose}
      	>
        	Cancelar
      	</Button>
    	</div>
  	</div>
	</div>
  );
}

export default CrearTrabajoModal;

