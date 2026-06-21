import api from "./api";

export const getIncidencias = async ({ estado, edificioId, categoria, prioridad } = {}) => {
  const params = new URLSearchParams();
  if (estado) params.append("estado", estado);
  if (edificioId) params.append("edificioId", edificioId);
  if (categoria) params.append("categoria", categoria);
  if (prioridad) params.append("prioridad", prioridad);

  const qs = params.toString();
  const url = qs ? `/incidencias?${qs}` : "/incidencias";

  const { data } = await api.get(url);
  return data?.incidencias || [];
};

export const getIncidencia = async (id) => {
  const { data } = await api.get(`/incidencias/${id}`);
  return data?.incidencia;
};

export const createIncidencia = async (incidencia) => {
  const { data } = await api.post("/incidencias", incidencia);
  return data?.incidencia;
};

export const updateIncidencia = async (id, cambios) => {
  const { data } = await api.put(`/incidencias/${id}`, cambios);
  return data?.incidencia;
};

export const cambiarEstadoIncidencia = async (id, { estadoNuevo, observacion }) => {
  const { data } = await api.patch(`/incidencias/${id}/estado`, {
	estadoNuevo,
	observacion,
  });
  return data?.incidencia;
};

export const agregarComentarioIncidencia = async (id, texto) => {
  const { data } = await api.post(`/incidencias/${id}/comentarios`, { texto });
  return data?.incidencia;
};

export const subirFotosIncidencia = async (id, formData) => {
  const { data } = await api.post(`/incidencias/${id}/fotos`, formData, {
	headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteIncidencia = async (id) => {
  const { data } = await api.delete(`/incidencias/${id}`);
  return data;
};

