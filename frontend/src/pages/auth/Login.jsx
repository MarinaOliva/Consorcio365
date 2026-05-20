import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../layouts/AuthLayout";
import NuevaContrasena from "./NuevaContrasena";
import ConfirmacionCambio from "./ConfirmacionCambio";
import RecuperarContrasena from "./RecuperarContrasena";
import { EyeOpenIcon, EyeClosedIcon } from "../../components/shared/icons";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showNuevaContrasena, setShowNuevaContrasena] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [showRecuperar, setShowRecuperar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const role = email.includes("admin")
      ? ROLES.ADMIN
      : email.includes("proveedor")
        ? ROLES.PROVEEDOR
        : ROLES.OCUPANTE;

    login(role);

    const esPrimerLogin = true;

    if (esPrimerLogin) {
      setShowNuevaContrasena(true);
    } else {
      navigate(`/${role}`);
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
            className="
              w-full 
              h-8 
              text-sm 
              bg-primary 
              hover:bg-primaryHover 
              text-white
              shadow-[0_2px_3px_rgba(0,0,0,0.35)]
            "
          >
            INGRESAR
          </Button>
        </form>
      </AuthLayout>

      {/* MODALES */}
      <NuevaContrasena
        isOpen={showNuevaContrasena}
        onSuccess={() => {
          setShowNuevaContrasena(false);
          setShowConfirmacion(true);
        }}
      />

      <ConfirmacionCambio
        isOpen={showConfirmacion}
        onAccept={() => {
          setShowConfirmacion(false);
          navigate("/admin");
        }}
      />

      <RecuperarContrasena
        isOpen={showRecuperar}
        onClose={() => setShowRecuperar(false)}
      />
    </>
  );
}

export default Login;
