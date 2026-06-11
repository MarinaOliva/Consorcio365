import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPasswordRequest } from "../../services/passwordService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Si entró sin token, mostramos mensaje
  if (!token) {
	return (
  	<AuthLayout>
    	<div className="text-center space-y-3">
      	<h3 className="text-base font-semibold text-textMain">
        	Enlace inválido
      	</h3>
      	<p className="text-xs text-textMuted">
        	El enlace de recuperación no es válido o expiró.
      	</p>
      	<Button
        	type="button"
        	size="sm"
        	className="w-full"
        	onClick={() => navigate("/login")}
      	>
        	Volver al inicio de sesión
      	</Button>
    	</div>
  	</AuthLayout>
	);
  }

  const handleSubmit = async (e) => {
	e.preventDefault();
	setError("");
	setSuccess("");

	if (!nueva || !confirmar) {
  	setError("Completá ambos campos");
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
  	await resetPasswordRequest(token, nueva);
  	setSuccess("Contraseña actualizada. Redirigiendo al inicio de sesión...");
  	setTimeout(() => navigate("/login", { replace: true }), 2000);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo actualizar la contraseña";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  return (
	<AuthLayout>
  	<h3 className="text-base font-semibold text-center mb-1 text-textMain">
    	Restablecer contraseña
  	</h3>

  	<p className="text-xs text-textMuted text-center mb-4">
    	Ingresá tu nueva contraseña.
  	</p>

  	<form onSubmit={handleSubmit} className="space-y-2 text-left">
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
    	{success && <p className="text-xs text-emerald-600">{success}</p>}

    	<Button
      	type="submit"
      	size="sm"
      	className="w-full mt-4"
      	disabled={loading || !!success}
    	>
      	{loading ? "Guardando..." : "Guardar contraseña"}
    	</Button>
  	</form>
	</AuthLayout>
  );
}

export default ResetPassword;

