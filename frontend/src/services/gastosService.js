import api from "./api";

export const getGastos = async ({ edificioId, tipo, desde, hasta } = {}) => {
  const params = new URLSearchParams();
  if (edificioId) params.append("edificioId", edificioId);
  if (tipo) params.append("tipo", tipo);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);

  const qs = params.toString();
  const url = qs ? `/gastos?${qs}` : "/gastos";

  const { data } = await api.get(url);
  return data?.gastos || [];
};

export const createGastoManual = async (formData) => {
  const { data } = await api.post("/gastos", formData, {
	headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.gasto;
};

export const deleteGasto = async (id) => {
  const { data } = await api.delete(`/gastos/${id}`);
  return data;
};

