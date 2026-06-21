import { KeyRound, PencilLine } from "lucide-react";
import Button from "../ui/Button";

function AccionesPerfil({
  onEditarDatos = () => {},
  onCambiarContrasena = () => {},
}) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
      <Button
        variant="ghost"
        size="md"
        type="button"
        onClick={onEditarDatos}
        className="min-w-[170px] gap-2 bg-primarySoft/50"
      >
        <PencilLine size={15} />
        Editar datos
      </Button>

      <Button
        variant="ghost"
        size="md"
        type="button"
        onClick={onCambiarContrasena}
        className="min-w-[190px] gap-2 bg-primarySoft/50"
      >
        <KeyRound size={15} />
        Cambiar contraseña
      </Button>
    </div>
  );
}

export default AccionesPerfil;