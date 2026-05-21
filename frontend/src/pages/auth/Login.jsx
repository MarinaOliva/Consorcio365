import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../layouts/AuthLayout";
import NuevaContrasena from "./NuevaContrasena";
import ConfirmacionCambio from "./ConfirmacionCambio";
import RecuperarContrasena from "./RecuperarContrasena";
import { EyeOpenIcon, EyeClosedIcon } from "../../components/shared/icons";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showNuevaContrasena, setShowNuevaContrasena] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [showRecuperar, setShowRecuperar] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya está logueada, no deja volver al login
  useEffect(() => {
	if (user) {
  	navigate(`/${user.role}`, { replace: true });
	}
  }, [user, navigate]);

  const handleSubmit = async (e) => {
	e.preventDefault();
	setError("");
	setLoading(true);

	try {
  	const user = await login(email, password);

  	// Primer login - mostrar modal obligatorio
  	if (user.debeCambiarPassword) {
    	setShowNuevaContrasena(true);
  	} else {
    	navigate(`/${user.role}`);
  	}
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"Credenciales inválidas";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  return (
	<>
  	<AuthLayout>
    	<form onSubmit={handleSubmit} className="space-y-1 text-left">
      	{/* EMAIL */}
      	<div>
        	<label className="block text-xs font-medium text-textMain/80 mb-1">
          	Email
        	</label>
        	<Input
          	type="email"
          	value={email}
          	onChange={(e) => setEmail(e.target.value)}
          	required
          	className="h-8"
        	/>
      	</div>

      	{/* CONTRASEÑA */}
      	<div>
        	<label className="block text-xs font-medium text-textMain/80 mb-1">
          	Contraseña
        	</label>

        	<div className="relative">
          	<Input
            	type={showPassword ? "text" : "password"}
            	value={password}
            	onChange={(e) => setPassword(e.target.value)}
            	required
            	className="pr-10 h-8"
          	/>

          	<button
            	type="button"
            	onClick={() => setShowPassword(!showPassword)}
            	className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain"
          	>
            	{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          	</button>
        	</div>
      	</div>

      	{/* ERROR */}
      	{error && (
        	<p className="text-xs text-red-500 mt-1">
          	{error}
        	</p>
      	)}

      	{/* OPCIONES */}
      	<div className="flex items-center justify-between text-xs text-textMain/70">
        	<label className="flex items-center gap-2">
          	<input
            	type="checkbox"
            	className="
              	w-4 h-4
              	rounded
              	border border-primary
              	bg-transparent
              	shadow-[0_1px_2px_rgba(0,0,0,0.35)]
              	appearance-none

              	flex items-center justify-center

              	checked:bg-transparent
              	checked:border-primary
              	checked:border-2

              	checked:after:content-['✔']
              	checked:after:text-primary
              	checked:after:text-[12px]
              	checked:after:leading-none

              	cursor-pointer
            	"
          	/>
          	Recordarme
        	</label>

        	<button
          	type="button"
          	onClick={() => setShowRecuperar(true)}
          	className="text-primary hover:underline"
        	>
          	¿Olvidaste tu contraseña?
        	</button>
      	</div>

      	{/* BOTÓN */}
      	<Button
        	type="submit"
        	disabled={loading}
        	className="
          	w-full
          	h-8
          	text-sm
          	bg-primary
          	hover:bg-primaryHover
          	text-white
          	shadow-[0_2px_3px_rgba(0,0,0,0.35)]
          	disabled:opacity-60
          	disabled:cursor-not-allowed
        	"
      	>
        	{loading ? "INGRESANDO..." : "INGRESAR"}
      	</Button>
    	</form>
  	</AuthLayout>

  	{/* MODAL: Primera contraseña */}
  	<NuevaContrasena
    	isOpen={showNuevaContrasena}
    	onSuccess={() => {
      	setShowNuevaContrasena(false);
      	setShowConfirmacion(true);
    	}}
  	/>

  	{/* MODAL: Confirmación */}
  	<ConfirmacionCambio
    	isOpen={showConfirmacion}
    	onAccept={() => {
      	setShowConfirmacion(false);

      	const stored = localStorage.getItem("user");
      	const u = stored ? JSON.parse(stored) : null;

      	navigate(u?.role ? `/${u.role}` : "/");
    	}}
  	/>

  	{/* MODAL: Recuperar contraseña */}
  	<RecuperarContrasena
    	isOpen={showRecuperar}
    	onClose={() => setShowRecuperar(false)}
  	/>
	</>
  );
}

export default Login;

