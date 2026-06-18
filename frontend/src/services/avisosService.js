import api from "./api";

export const getAvisos = async ({ edificioId, desde, hasta } = {}) => {
  const params = new URLSearchParams();
  if (edificioId) params.append("edificioId", edificioId);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);

  const qs = params.toString();
  const url = qs ? `/avisos?${qs}` : "/avisos";

  const { data } = await api.get(url);
  return data?.avisos || [];
};

export const getAviso = async (id) => {
  const { data } = await api.get(`/avisos/${id}`);
  return data?.aviso;
};

export const createAviso = async (aviso) => {
  const { data } = await api.post("/avisos", aviso);
  return data?.aviso;
};

export const updateAviso = async (id, aviso) => {
  const { data } = await api.put(`/avisos/${id}`, aviso);
  return data?.aviso;
};

export const deleteAviso = async (id) => {
  const { data } = await api.delete(`/avisos/${id}`);
  return data;
};

