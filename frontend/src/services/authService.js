import api from "./api";
import { ROLES } from "../utils/roles";

// Mapeo del "tipo" del back a las constantes ROLES del front
const mapTipoToRole = (tipo) => {
  switch ((tipo || "").toLowerCase()) {
	case "administrador":
  	return ROLES.ADMIN;
	case "proveedor":
  	return ROLES.PROVEEDOR;
	case "ocupante":
  	return ROLES.OCUPANTE;
	default:
  	return ROLES.OCUPANTE;
  }
};

export const loginRequest = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });

  if (!data?.success) {
	throw new Error(data?.message || "Login fallido");
  }

  const { token, usuario } = data;

  const user = {
	id: usuario.id,
	name: `${usuario.nombre} ${usuario.apellido}`,
	email: usuario.email,
	role: mapTipoToRole(usuario.tipo),   
	tipo: usuario.tipo,
	estado: usuario.estado,
	debeCambiarPassword: usuario.debeCambiarPassword,
	proveedorDetalle: usuario.proveedorDetalle || null,
  };

  return { token, user };
};

