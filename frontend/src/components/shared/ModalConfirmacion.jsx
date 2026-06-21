import { AlertTriangle, Info, X } from "lucide-react";
import Button from "../ui/Button";

function ModalConfirmacion({
  isOpen,
  title = "Confirmar acción",
  message = "¿Deseás continuar con esta acción?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm = () => {},
  onClose = () => {},
  variant = "danger",
  details = [],
}) {
  if (!isOpen) return null;

  const variantes = {
    danger: {
      icono: AlertTriangle,
      iconoClase: "text-red-500",
      cajaClase: "border-red-200 bg-red-50/80",
      textoClase: "text-red-600",
      botonVariant: "danger",
    },
    warning: {
      icono: AlertTriangle,
      iconoClase: "text-yellow-600",
      cajaClase: "border-yellow-200 bg-yellow-50/80",
      textoClase: "text-yellow-700",
      botonVariant: "ghost",
    },
    info: {
      icono: Info,
      iconoClase: "text-blue-500",
      cajaClase: "border-blue-200 bg-blue-50/80",
      textoClase: "text-blue-700",
      botonVariant: "secondary",
    },
  };

  const configuracion = variantes[variant] || variantes.danger;
  const Icono = configuracion.icono;

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
        aria-labelledby="modal-confirmacion-title"
        className="
          relative z-10 flex w-full max-w-[520px] flex-col overflow-hidden
          rounded-2xl border border-white/40 bg-[#cfd8dc]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2 id="modal-confirmacion-title" className="text-base font-bold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 transition hover:bg-white/15"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-8 py-6">
          <div
            className={`flex items-start gap-4 rounded-xl border p-4 ${configuracion.cajaClase}`}
          >
            <div className={`mt-0.5 shrink-0 ${configuracion.iconoClase}`}>
              <Icono size={24} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-textMain">{message}</p>
              <p className={`text-xs ${configuracion.textoClase}`}>
                Esta acción puede ser irreversible.
              </p>
            </div>
          </div>

          {details.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-white/70 p-4 sm:grid-cols-2">
              {details.map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] font-bold uppercase text-textMuted">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-textMain">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-center gap-5 border-t border-border px-6 py-5">
          <Button
            variant={configuracion.botonVariant}
            size="md"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>

          <Button
            variant="neutral"
            size="md"
            type="button"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;