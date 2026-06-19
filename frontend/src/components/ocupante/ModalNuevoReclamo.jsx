import { useMemo, useRef } from "react";
import { Paperclip, X } from "lucide-react";
import Button from "../ui/Button";

function CampoInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full rounded-lg border border-primary/40 bg-white
        px-4 py-3 text-sm text-textMain
        outline-none transition
        placeholder:text-textMuted
        focus:border-primary focus:ring-2 focus:ring-primary/20
      "
    />
  );
}

function CampoTextarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="
        w-full resize-none rounded-lg border border-primary/40 bg-white
        px-4 py-3 text-sm text-textMain
        outline-none transition
        placeholder:text-textMuted
        focus:border-primary focus:ring-2 focus:ring-primary/20
      "
    />
  );
}

function CampoSelect({ value, onChange, options = [], placeholder = "Seleccione" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full rounded-lg border border-border bg-white
        px-4 py-3 text-sm text-textMain
        outline-none transition
        focus:border-primary focus:ring-2 focus:ring-primary/20
      "
    >
      <option value="">{placeholder}</option>
      {options.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  );
}

function ModalNuevoReclamo({
  isOpen,
  onClose,
  onCreate,
  form,
  onChange,
  unidadActual,
}) {
  const inputArchivoRef = useRef(null);

  const puedeCrear = useMemo(() => {
    return (
      form.titulo.trim() &&
      form.descripcion.trim() &&
      form.ubicacion.trim() &&
      form.categoria.trim() &&
      form.prioridad.trim()
    );
  }, [form]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crear-reclamo-title"
        className="
          relative z-10 flex max-h-[90dvh] w-full max-w-[560px]
          flex-col overflow-hidden rounded-2xl border border-secondary/60
          bg-surfaceSoft shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white">
          <h2 id="crear-reclamo-title" className="text-xl font-bold">
            Crear reclamo
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {/* Información básica */}
            <div className="rounded-xl border border-secondary/50 bg-white/65 px-4 py-4">
              <h3 className="mb-3 text-sm font-bold text-primary">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                <p>
                  <span className="font-semibold text-textMuted">Ocupante:</span>{" "}
                  <span className="font-bold text-textMain">
                    {unidadActual?.ocupante || "Usuario actual"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-textMuted">Estado:</span>{" "}
                  <span className="font-bold text-textMain">Abierta</span>
                </p>

                <p>
                  <span className="font-semibold text-textMuted">Unidad:</span>{" "}
                  <span className="font-bold text-textMain">
                    {unidadActual?.numero || "-"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-textMuted">Piso:</span>{" "}
                  <span className="font-bold text-textMain">
                    {unidadActual?.piso || "-"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-textMuted">Edificio:</span>{" "}
                  <span className="font-bold text-textMain">
                    {unidadActual?.torre || unidadActual?.edificio || "-"}
                  </span>
                </p>
              </div>
            </div>

            <CampoInput
              value={form.titulo}
              onChange={(valor) => onChange("titulo", valor)}
              placeholder="Título *"
            />

            <CampoTextarea
              value={form.descripcion}
              onChange={(valor) => onChange("descripcion", valor)}
              placeholder="Descripción del reclamo *"
            />

            <CampoInput
              value={form.ubicacion}
              onChange={(valor) => onChange("ubicacion", valor)}
              placeholder="Ubicación del problema (Ej: Unidad - Piso - Espacio común) *"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-textMain">
                  Categoría
                </label>
                <CampoSelect
                  value={form.categoria}
                  onChange={(valor) => onChange("categoria", valor)}
                  options={[
                    "Plomería",
                    "Electricidad",
                    "Calefacción",
                    "Infraestructura",
                    "Convivencia",
                    "Seguridad",
                    "Otro",
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMain">
                  Prioridad
                </label>
                <CampoSelect
                  value={form.prioridad}
                  onChange={(valor) => onChange("prioridad", valor)}
                  options={["Alta", "Media", "Baja"]}
                />
              </div>
            </div>

            <div className="pt-2">
              <input
                ref={inputArchivoRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => onChange("archivos", Array.from(e.target.files || []))}
              />

              <button
                type="button"
                onClick={() => inputArchivoRef.current?.click()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-2 transition hover:underline"
              >
                Adjuntar pruebas
                <Paperclip size={16} />
              </button>

              {form.archivos?.length > 0 && (
                <p className="mt-2 text-xs text-textMuted">
                  {form.archivos.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/70 px-6 py-5">
          <div className="flex flex-wrap justify-center gap-5">
            <Button
              variant="elevated"
              size="md"
              type="button"
              onClick={onCreate}
              disabled={!puedeCrear}
            >
              Crear
            </Button>

            <Button
              variant="danger"
              size="md"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalNuevoReclamo;