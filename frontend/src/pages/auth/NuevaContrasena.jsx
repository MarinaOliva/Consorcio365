import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/LOGO.png";

function NuevaContrasena({ isOpen, onSuccess }) {
  return (
    <Modal isOpen={isOpen}>
      <img
        src={logo}
        alt="Consorcio365"
        className="mx-auto mb-0 w-24 opacity-90"
      />

      <h3 className="text-base font-semibold text-center mt-1 mb-0 text-textMain">
        Crear nueva contraseña
      </h3>

      <p className="text-xs text-textMuted text-center mb-2">
        Ingresá tu nueva contraseña para restablecer el acceso a tu cuenta.
      </p>

      <div className="space-y-2">
        <Input label="Nueva contraseña" type="password" />
        <Input label="Confirmar contraseña" type="password" />
      </div>

      <div className="mt-3 text-xs text-textMuted space-y-1 leading-tight">
        
        <p className="font-medium text-textMain">
          La contraseña debe contener:
        </p>

        <p className="flex items-center gap-2">
          <span className="text-primary">✔</span>
          Al menos 8 caracteres
        </p>

        <p className="flex items-center gap-2">
          - Una letra mayúscula
        </p>

        <p className="flex items-center gap-2">
          - Un número
        </p>
      </div>

      <Button size="sm" className="w-full mt-4" onClick={onSuccess}>
        Guardar contraseña
      </Button>
    </Modal>
  );
}

export default NuevaContrasena;
