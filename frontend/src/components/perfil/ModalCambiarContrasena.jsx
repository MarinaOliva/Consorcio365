import { useMemo, useState } from "react";
import {  Eye, EyeOff, X, CheckCircle2, Circle } from "lucide-react";
import Button from "../ui/Button";

function CampoPassword({
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-textMain">{label}</label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full rounded-lg border border-primary/50 bg-white
            px-4 py-2.5 pr-12 text-sm text-textMain
            outline-none transition
            placeholder:text-textMuted
            focus:border-primary focus:ring-2 focus:ring-primary/15
          "
        />

        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted transition hover:text-primary"
          aria-label={visible ? "Mostrar contraseña" : "Ocultar contraseña" }
        >
          {visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}

function ItemRegla({ cumplida, children }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {cumplida ? (
        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
      ) : (
        <Circle size={16} className="shrink-0 fill-slate-200 text-primary" />
      )}

      <span className={cumplida ? "text-textMain" : "text-textMuted"}>
        {children}
      </span>
    </li>
  );
}

function ModalCambiarContrasena({
  isOpen,
  onClose,
  form,
  onChange,
  onSave,
  validaciones,
  passwordValida,
}) {
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const puedeGuardar = useMemo(() => passwordValida, [passwordValida]);

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
        aria-labelledby="cambiar-password-title"
        className="
          relative z-10 flex w-full max-w-[500px] max-h-[90dvh]
          flex-col overflow-hidden rounded-xl border border-secondary/70
          bg-surfaceSoft shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white">
          <h2 id="cambiar-password-title" className="text-xl font-bold">
            Cambiar Contraseña
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

        {/* Body scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            <CampoPassword
              label="Contraseña actual"
              value={form.contrasenaActual}
              onChange={(valor) => onChange("contrasenaActual", valor)}
              visible={mostrarActual}
              onToggleVisible={() => setMostrarActual((prev) => !prev)}
              placeholder="Ingresá tu contraseña actual"
            />

            <CampoPassword
              label="Nueva contraseña"
              value={form.nuevaContrasena}
              onChange={(valor) => onChange("nuevaContrasena", valor)}
              visible={mostrarNueva}
              onToggleVisible={() => setMostrarNueva((prev) => !prev)}
              placeholder="Ingresá la nueva contraseña"
            />

            <CampoPassword
              label="Confirmar nueva contraseña"
              value={form.confirmarNuevaContrasena}
              onChange={(valor) => onChange("confirmarNuevaContrasena", valor)}
              visible={mostrarConfirmacion}
              onToggleVisible={() => setMostrarConfirmacion((prev) => !prev)}
              placeholder="Repetí la nueva contraseña"
            />

            <div className="rounded-lg border border-border/70 bg-white/60 p-4">
              <p className="mb-3 text-sm font-semibold text-textMain">
                La contraseña debe contener:
              </p>

              <ul className="space-y-2">
                <ItemRegla cumplida={validaciones.min8}>
                  Al menos 8 carácteres.
                </ItemRegla>

                <ItemRegla cumplida={validaciones.mayuscula}>
                  Una letra mayúscula.
                </ItemRegla>

                <ItemRegla cumplida={validaciones.numero}>
                  Un número.
                </ItemRegla>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border/70 px-6 py-5">
          <div className="flex flex-wrap justify-center gap-5">
            <Button
              variant="elevated"
              size="md"
              type="button"
              onClick={onSave}
              disabled={!puedeGuardar}
            >
              Guardar
            </Button>

            <Button variant="neutral" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCambiarContrasena;

