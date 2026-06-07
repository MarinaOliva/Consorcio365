import { X, Paperclip, ChevronDown } from "lucide-react";
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
          w-full rounded-lg border border-slate-300 bg-white
          px-4 py-3 text-sm text-slate-800 shadow-sm
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

function CampoSelect({ label, value, onChange, options = [], placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            w-full appearance-none rounded-lg border border-slate-300 bg-white
            px-4 py-3 pr-11 text-sm text-slate-800 shadow-sm
            outline-none transition
            focus:border-primary focus:ring-2 focus:ring-purple-900/40
          "
        >
          <option value="">{placeholder}</option>
          {options.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
          <ChevronDown size={18} />
        </span>
      </div>
    </div>
  );
}

function CrearTrabajoModal({
  isOpen,
  onClose,
  onCreate,
  incidencia,
  values,
  onChange,
}) {
  if (!isOpen) return null;

  const actualizarCampo = (campo, valor) => {
    onChange?.(campo, valor);
  };

  const handleCreate = () => {
    onCreate?.();
  };

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
          {/* Información básica */}
          <div className="rounded-xl border border-secondary/60 bg-white/70 px-4 py-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-primary">
              Información básica
            </h3>

            <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-xs sm:grid-cols-2 md:grid-cols-3">
              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Incidencia ID
                </span>
                <span className="font-bold text-textMain">
                  #{incidencia?.id ?? "-"}
                </span>
              </p>

              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Estado
                </span>
                <span className="font-bold text-textMain">
                  {incidencia?.estado ?? "Pendiente"}
                </span>
              </p>

              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Categoría
                </span>
                <span className="font-bold text-textMain">
                  {incidencia?.categoria ?? "-"}
                </span>
              </p>

              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Unidad
                </span>
                <span className="font-bold text-textMain">
                  {incidencia?.unidad ?? "-"}
                </span>
              </p>

              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Piso
                </span>
                <span className="font-bold text-textMain">
                  {incidencia?.piso ?? "-"}
                </span>
              </p>

              <p>
                <span className="block font-semibold uppercase text-textMuted">
                  Edificio
                </span>
                <span className="font-bold text-textMain">
                  {incidencia?.edificio ?? "-"}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <CampoTexto
              label="Trabajo"
              value={values?.titulo ?? ""}
              onChange={(valor) => actualizarCampo("titulo", valor)}
              placeholder="Ingresá el nombre del trabajo"
              required
            />

            <CampoArea
              label="Descripción del trabajo"
              value={values?.descripcion ?? ""}
              onChange={(valor) => actualizarCampo("descripcion", valor)}
              placeholder="Describí las tareas a realizar"
              required
            />

            <CampoTexto
              label="Responsable"
              value={values?.responsable ?? ""}
              onChange={(valor) => actualizarCampo("responsable", valor)}
              placeholder="Nombre del responsable o proveedor"
              required
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CampoTexto
                label="Fecha de inicio estimada"
                type="date"
                value={values?.fechaInicioEstimada ?? ""}
                onChange={(valor) =>
                  actualizarCampo("fechaInicioEstimada", valor)
                }
                placeholder="Seleccioná una fecha"
              />

              <CampoTexto
                label="Costo estimado"
                value={values?.costoEstimado ?? ""}
                onChange={(valor) => actualizarCampo("costoEstimado", valor)}
                placeholder="Ej: $25.000"
              />
            </div>

            <CampoSelect
              label="Prioridad"
              value={values?.prioridad ?? ""}
              onChange={(valor) => actualizarCampo("prioridad", valor)}
              placeholder="Seleccione prioridad"
              options={["Alta", "Media", "Baja"]}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                A cargo de
              </p>

              <div className="flex flex-wrap gap-6">
                {["Propietario", "Inquilino", "Consorcio"].map((opcion) => (
                  <label
                    key={opcion}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      name="a-cargo-de"
                      value={opcion}
                      checked={values?.aCargoDe === opcion}
                      onChange={(e) =>
                        actualizarCampo("aCargoDe", e.target.value)
                      }
                      className="
                        relative h-4 w-4 appearance-none rounded-full
                        border-2 border-slate-500 bg-white transition
                        focus:outline-none focus:ring-1 focus:ring-[#582367]
                        checked:border-[#582367]
                        checked:after:absolute
                        checked:after:inset-[3px]
                        checked:after:rounded-full
                        checked:after:bg-[#582367]
                        checked:after:content-['']
                      "
                    />

                    <span className="select-none">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-full border border-primary
                bg-white/40 px-4 py-2 text-sm font-semibold text-primary
                shadow-sm transition
                hover:border-primaryHover hover:bg-primarySoft hover:text-primaryHover
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
              "
            >
              <Paperclip size={16} />
              Adjuntar archivo
            </button>
          </div>
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