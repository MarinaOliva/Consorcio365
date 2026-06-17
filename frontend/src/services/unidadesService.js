import api from "./api";

export const getUnidades = async () => {
  const { data } = await api.get("/unidades");
  return data?.unidades || [];
};

export const vincularOcupante = async (unidadId, { ocupanteId, rolEnUnidad }) => {
  const { data } = await api.post(`/unidades/${unidadId}/vincular-ocupante`, {
	ocupanteId,
	rolEnUnidad,
  });
  return data?.unidad;
};

export const desvincularOcupante = async (unidadId, relacionId) => {
  const { data } = await api.put(`/unidades/${unidadId}/desvincular-ocupante/${relacionId}`);
  return data?.unidad;
};
