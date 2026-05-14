import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/LOGO.png";

function RecuperarContrasena({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen}>
      <img
        src={logo}
        alt="Consorcio365"
        className="mx-auto mb-4 w-24"
      />
      
      <h3 className="text-lg font-semibold text-center mt-2 mb-2 text-textMain">
        Recuperar contraseña
      </h3>

      <p className="text-sm text-textMuted text-center mb-4">
        Ingresá tu email y te enviaremos un enlace para restablecerla.
      </p>

      <Input label="Email" type="email" />

      <Button className="w-full mt-4">
        Enviar enlace
      </Button>

      <button
        className="mt-4 text-sm text-primary hover:text-primaryHover w-full"
        onClick={onClose}
      >
        ← Volver al inicio de sesión
      </button>
    </Modal>
  );
}

export default RecuperarContrasena;