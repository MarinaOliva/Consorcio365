import api from "./api";

export const getEdificios = async () => {
  const { data } = await api.get("/edificios");
  return data?.edificios || [];
};

export const getEdificio = async (id) => {
  const { data } = await api.get(`/edificios/${id}`);
  return data?.edificio;
};

export const updateEdificio = async (id, edificio) => {
  const { data } = await api.put(`/edificios/${id}`, edificio);
  return data?.edificio;
};

