import api from "./api";

export const getIncidencias = async ({ estado, edificioId } = {}) => {
  const params = new URLSearchParams();
  if (estado) params.append("estado", estado);
  if (edificioId) params.append("edificioId", edificioId);

  const qs = params.toString();
  const url = qs ? `/incidencias?${qs}` : "/incidencias";

  const { data } = await api.get(url);
  return data?.incidencias || [];
};

export const getIncidencia = async (id) => {
  const { data } = await api.get(`/incidencias/${id}`);
  return data?.incidencia;
};

