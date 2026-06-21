import api from "./api";

// ENDPOINTS

// Lista usuarios con filtros opcionales.

export const getUsuarios = async ({ tipo, estado } = {}) => {
  const params = new URLSearchParams();
  if (tipo && tipo !== "todos") params.append("tipo", tipo);
  if (estado && estado !== "todos") params.append("estado", estado);

  const qs = params.toString();
  const url = qs ? `/usuarios?${qs}` : "/usuarios";

  const { data } = await api.get(url);
  return data?.usuarios || [];
};

//Obtiene un usuario por ID.

export const getUsuario = async (id) => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data?.usuario;
};

// Crea un usuario nuevo.

export const createUsuario = async (usuario, passwordTemporal = "Temporal123!") => {
  const { data } = await api.post("/usuarios", {
	...usuario,
	passwordTemporal,
  });
  return data?.usuario;
};

// Actualiza un usuario.
export const updateUsuario = async (id, usuario) => {
  const { data } = await api.put(`/usuarios/${id}`, usuario);
  return data?.usuario;
};

// Soft delete: marca como INACTIVO.
export const deleteUsuario = async (id) => {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};

