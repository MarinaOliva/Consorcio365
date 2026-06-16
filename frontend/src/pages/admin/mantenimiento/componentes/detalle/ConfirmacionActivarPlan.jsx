import { useEffect } from "react";
import { CircleAlert, X } from "lucide-react";
import Button from "../../../../../components/ui/Button";

function ConfirmacionActivarPlan({
  isOpen,
  onClose,
  onConfirm,
  nombrePlan = "este plan",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const overflowOriginal = document.body.style.overflow;

    const manejarTeclaPresionada = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manejarTeclaPresionada);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", manejarTeclaPresionada);
    };
  }, [isOpen, onClose]);

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
        aria-labelledby="confirmacion-activar-plan-title"
        className="
          relative z-10 flex w-full max-w-[460px] flex-col overflow-hidden
          rounded-2xl border border-white/40 bg-[#cfd8dc]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2
            id="confirmacion-activar-plan-title"
            className="text-base font-bold"
          >
            Activar plan
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

        <div className="px-8 py-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-primary">
            <CircleAlert size={26} />
          </div>

          <p className="text-lg font-bold text-primary">
            ¿Deseás activar este plan?
          </p>

          <p className="mt-3 text-sm leading-relaxed text-textMain">
            Se activará <span className="font-semibold text-textsecondary">{nombrePlan}</span>{" "}
            y quedará disponible para programar una nueva instancia.
          </p>
        </div>

        <div className="flex justify-center gap-5 border-t border-border px-6 py-5">
          <Button variant="elevated" type="button" onClick={onConfirm}>
            Confirmar
          </Button>

          <Button variant="neutral" type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmacionActivarPlan;