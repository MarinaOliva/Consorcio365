import api from "./api";

export const getUnidades = async ({ edificioId, estado } = {}) => {
  const params = new URLSearchParams();
  if (edificioId) params.append("edificioId", edificioId);
  if (estado) params.append("estado", estado);

  const qs = params.toString();
  const url = qs ? `/unidades?${qs}` : "/unidades";

  const { data } = await api.get(url);
  return data?.unidades || [];
};

export const getUnidad = async (id) => {
  const { data } = await api.get(`/unidades/${id}`);
  return data?.unidad;
};

export const updateUnidad = async (id, cambios) => {
  const { data } = await api.put(`/unidades/${id}`, cambios);
  return data?.unidad;
};

export const vincularOcupante = async (unidadId, { ocupanteId, rolEnUnidad }) => {
  const { data } = await api.post(`/unidades/${unidadId}/vincular-ocupante`, {
	ocupanteId,
	rolEnUnidad,
  });
  return data?.unidad;
};

export const desvincularOcupante = async (unidadId, relacionId) => {
  const { data } = await api.put(
	`/unidades/${unidadId}/desvincular-ocupante/${relacionId}`
  );
  return data?.unidad;
};