import api from "./api";

export const getDocumentos = async ({ edificioId, categoria, visibilidad } = {}) => {
  const params = new URLSearchParams();
  if (edificioId) params.append("edificioId", edificioId);
  if (categoria) params.append("categoria", categoria);
  if (visibilidad) params.append("visibilidad", visibilidad);

  const qs = params.toString();
  const url = qs ? `/documentos?${qs}` : "/documentos";

  const { data } = await api.get(url);
  return data?.documentos || [];
};

export const getDocumento = async (id) => {
  const { data } = await api.get(`/documentos/${id}`);
  return data?.documento;
};

// Crea un documento subiendo el archivo. 

export const createDocumento = async (formData) => {
  const { data } = await api.post("/documentos", formData, {
	headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.documento;
};

export const deleteDocumento = async (id) => {
  const { data } = await api.delete(`/documentos/${id}`);
  return data;
};

