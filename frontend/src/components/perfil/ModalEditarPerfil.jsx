import { X } from "lucide-react";
import Button from "../ui/Button";

function CampoPerfil({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-textMain">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-primary/50 bg-white
          px-4 py-2.5 text-sm text-textMain
          outline-none transition
          placeholder:text-textMuted
          focus:border-primary focus:ring-2 focus:ring-primary/15
        "
      />
    </div>
  );
}

function ModalEditarPerfil({
  isOpen,
  onClose,
  form,
  onChange,
  onSave,
}) {
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
        aria-labelledby="editar-perfil-title"
        className="
          relative z-10 w-full max-w-[520px]
          overflow-hidden rounded-xl border border-secondary/70
          bg-surfaceSoft shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
        "
      >
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white">
          <h2 id="editar-perfil-title" className="text-xl font-bold">
            Editar datos personales
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

        <div className="space-y-5 px-6 py-6">
          <CampoPerfil
            label="Nombre"
            value={form.nombre}
            onChange={(valor) => onChange("nombre", valor)}
            placeholder="Ingresá tu nombre"
          />

          <CampoPerfil
            label="Apellido"
            value={form.apellido}
            onChange={(valor) => onChange("apellido", valor)}
            placeholder="Ingresá tu apellido"
          />

          <CampoPerfil
            label="Teléfono"
            value={form.telefono}
            onChange={(valor) => onChange("telefono", valor)}
            placeholder="+54 11 4567-8900"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-5 px-6 pb-6">
          <Button variant="elevated" size="md" type="button" onClick={onSave}>
            Guardar
          </Button>

          <Button variant="neutral" size="md" type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalEditarPerfil;