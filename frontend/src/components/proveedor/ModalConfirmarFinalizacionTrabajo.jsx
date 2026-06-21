import { CircleAlert, X } from "lucide-react";
import Button from "../ui/Button";

function ModalConfirmarFinalizacionTrabajo({
  isOpen,
  onClose,
  onConfirm,
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
        aria-labelledby="confirmar-finalizacion-title"
        className="
          relative z-10 flex w-full max-w-[440px] max-h-[90dvh] flex-col overflow-hidden
          rounded-xl border border-secondary/70 bg-surfaceSoft
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white">
          <h2 id="confirmar-finalizacion-title" className="text-lg font-bold">
            Trabajo finalizado
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
        <div className="flex-1 overflow-y-auto px-6 py-6 text-center">
            <div className="space-y-6">
                <p className="text-[18px] leading-snug text-textMain">
                    ¿Confirma que el trabajo fue completado? El administrador revisará
                    las evidencias antes de cerrar.
                </p>

                <div className="flex items-start justify-center gap-2 rounded-lg bg-white/60 px-4 py-3">
                    <CircleAlert size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm font-semibold text-red-600">
                    Una vez marcado como finalizado, no podrá subir más evidencias.
                    </p>
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
              onClick={onConfirm}
            >
              Confirmar
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
    </div>
  );
}

export default ModalConfirmarFinalizacionTrabajo;