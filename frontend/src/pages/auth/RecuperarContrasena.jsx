import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import logo from "../../assets/LOGO.png";
import { recuperarPasswordRequest } from "../../services/passwordService";

function RecuperarContrasena({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
	e?.preventDefault?.();
	setError("");
	setSuccess("");

	if (!email) {
  	setError("Ingresá tu email");
  	return;
	}

	setLoading(true);
	try {
  	await recuperarPasswordRequest(email);
  	// Mensaje genérico (por seguridad no decimos si el email existe o no)
  	setSuccess(
    	"Si el email existe en nuestro sistema, vas a recibir las instrucciones en tu casilla."
  	);
  	setEmail("");
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo enviar el mail";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  const handleClose = () => {
	setEmail("");
	setError("");
	setSuccess("");
	onClose?.();
  };

  return (
	<Modal isOpen={isOpen}>
  	<img src= {logo} alt="Logo" className="mx-auto mb-0 w-24 opacity-90" />

  	<h3 className="text-lg font-semibold text-center mt-2 mb-2 text-textMain">
    	Recuperar contraseña
  	</h3>

  	<p className="text-sm text-textMuted text-center mb-4">
    	Ingresá tu email y te enviaremos un enlace para restablecerla.
  	</p>

  	<form onSubmit={handleSubmit}>
    	<Input
      	label="Email"
      	type="email"
      	value={email}
      	onChange={(e) => setEmail(e.target.value)}
    	/>

    	{error && (
      	<p className="text-xs text-red-500 mt-2">{error}</p>
    	)}
    	{success && (
      	<p className="text-xs text-emerald-600 mt-2">{success}</p>
    	)}

    	<Button
      	type="submit"
      	className="w-full mt-4"
      	disabled={loading}
    	>
      	{loading ? "Enviando..." : "Enviar enlace"}
    	</Button>
  	</form>

  	<button
    	type="button"
    	className="mt-4 text-sm text-primary hover:text-primaryHover w-full"
    	onClick={handleClose}
  	>
    	← Volver al inicio de sesión
  	</button>
	</Modal>
  );
}

export default RecuperarContrasena;

