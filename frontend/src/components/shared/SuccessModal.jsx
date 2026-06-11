import Button from "../ui/Button";
import { CheckCircle2 } from "lucide-react";

function SuccessModal({
  isOpen,
  onClose,
  message = "Cambios guardados con éxito",
}) {
  if (!isOpen) return null;

  return (
	<div className="fixed inset-0 z-50 flex items-center justify-center">
  	<div className="absolute inset-0 bg-black/40" />

  	<div
    	className="
      	relative z-10
      	w-full max-w-[420px]
      	rounded-xl bg-surfaceSoft
      	px-8 py-10
      	text-center
      	shadow-[0_0_30px_rgba(88,35,103,0.35)]
    	"
  	>
    	<h2 className="mb-6 text-lg font-bold text-primary">{message}</h2>

    	<Button variant="elevated" onClick={onClose}>
      	<CheckCircle2 size={16} />
      	Aceptar
    	</Button>
  	</div>
	</div>
  );
}

export default SuccessModal;

