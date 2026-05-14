import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

function ConfirmacionCambio({ isOpen, onAccept, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        
        <h3 className="text-base font-semibold text-textMain mb-4">
          Contraseña cambiada con éxito
        </h3>

        <Button onClick={onAccept} size="sm">
          Aceptar
        </Button>

      </div>
    </Modal>
  );
}

export default ConfirmacionCambio;