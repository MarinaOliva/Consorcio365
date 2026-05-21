import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/LOGO.png";
import { cambiarPasswordRequest } from "../../services/passwordService";

function NuevaContrasena({ isOpen, onSuccess }) {
  const [passwordActual, setPasswordActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
	e?.preventDefault?.();
	setError("");

	if (!passwordActual) {
  	setError("Ingresá tu contraseña actual");
  	return;
	}
	if (!nueva || !confirmar) {
  	setError("Completá ambos campos de nueva contraseña");
  	return;
	}
	if (nueva !== confirmar) {
  	setError("Las contraseñas no coinciden");
  	return;
	}
	if (nueva.length < 8) {
  	setError("La contraseña debe tener al menos 8 caracteres");
  	return;
	}

	setLoading(true);
	try {
  	await cambiarPasswordRequest(passwordActual, nueva);
  	onSuccess?.();
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo cambiar la contraseña";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  return (
	<Modal isOpen={isOpen}>
  	<img src= {logo} alt="Logo" className="mx-auto mb-0 w-24 opacity-90" />

  	<h3 className="text-base font-semibold text-center mt-1 mb-0 text-textMain">
    	Crear nueva contraseña
  	</h3>

  	<p className="text-xs text-textMuted text-center mb-2">
    	Ingresá tu nueva contraseña para restablecer el acceso a tu cuenta.
  	</p>

  	<form onSubmit={handleSubmit} className="space-y-2">
    	<Input
      	label="Contraseña actual"
      	type="password"
      	value={passwordActual}
      	onChange={(e) => setPasswordActual(e.target.value)}
    	/>
    	<Input
      	label="Nueva contraseña"
      	type="password"
      	value={nueva}
      	onChange={(e) => setNueva(e.target.value)}
    	/>
    	<Input
      	label="Confirmar contraseña"
      	type="password"
      	value={confirmar}
      	onChange={(e) => setConfirmar(e.target.value)}
    	/>

    	{error && <p className="text-xs text-red-500">{error}</p>}

    	<div className="mt-3 text-xs text-textMuted space-y-1 leading-tight">
      	<p className="font-medium text-textMain">
        	La contraseña debe contener:
      	</p>
      	<p className="flex items-center gap-2">
        	<span className="text-primary">✔</span>
        	Al menos 8 caracteres
      	</p>
      	<p className="flex items-center gap-2">- Una letra mayúscula</p>
      	<p className="flex items-center gap-2">- Un número</p>
    	</div>

    	<Button
      	type="submit"
      	size="sm"
      	className="w-full mt-4"
      	disabled={loading}
    	>
      	{loading ? "Guardando..." : "Guardar contraseña"}
    	</Button>
  	</form>
	</Modal>
  );
}

export default NuevaContrasena;

