import api from "./api";

// Primer login: cambiar contraseña (usuario logueado)
export const cambiarPasswordRequest = async (passwordActual, nuevaPassword) => {
  const { data } = await api.post("/auth/cambiar-password", {
	passwordActual,
	nuevaPassword,
  });
  return data;
};

//Pedir mail de recuperación
export const recuperarPasswordRequest = async (email) => {
  const { data } = await api.post("/auth/recuperar", { email });
  return data;
};

// Resetear contraseña con token del mail
export const resetPasswordRequest = async (token, nuevaPassword) => {
  const { data } = await api.post("/auth/reset-password", {
	token,
	nuevaPassword,
  });
  return data;
};

