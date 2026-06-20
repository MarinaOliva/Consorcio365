import api from "./api";

// PLANES

export const getPlanes = async ({ edificioId, activo } = {}) => {
  const params = new URLSearchParams();
  if (edificioId) params.append("edificioId", edificioId);
  if (activo !== undefined) params.append("activo", activo);

  const qs = params.toString();
  const url = qs ? `/mantenimiento/planes?${qs}` : "/mantenimiento/planes";

  const { data } = await api.get(url);
  return data?.planes || [];
};

export const getPlan = async (id) => {
  const { data } = await api.get(`/mantenimiento/planes/${id}`);
  return data; // viene { plan, proximaFechaSugerida, ultimasInstancias }
};

export const createPlan = async (plan) => {
  const { data } = await api.post("/mantenimiento/planes", plan);
  return data?.plan;
};

export const updatePlan = async (id, cambios) => {
  const { data } = await api.put(`/mantenimiento/planes/${id}`, cambios);
  return data?.plan;
};

export const desactivarPlan = async (id) => {
  const { data } = await api.delete(`/mantenimiento/planes/${id}`);
  return data;
};


// INSTANCIAS

export const getInstancias = async ({ planId, estado, desde, hasta } = {}) => {
  const params = new URLSearchParams();
  if (planId) params.append("planId", planId);
  if (estado) params.append("estado", estado);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);

  const qs = params.toString();
  const url = qs ? `/mantenimiento/instancias?${qs}` : "/mantenimiento/instancias";

  const { data } = await api.get(url);
  return data?.instancias || [];
};

export const getInstancia = async (id) => {
  const { data } = await api.get(`/mantenimiento/instancias/${id}`);
  return data; 
};

export const createInstancia = async ({ planId, fechaProgramada }) => {
  const { data } = await api.post("/mantenimiento/instancias", {
	planId,
	fechaProgramada,
  });
  return data?.instancia;
};

export const cambiarEstadoInstancia = async (id, estadoNuevo) => {
  const { data } = await api.patch(`/mantenimiento/instancias/${id}/estado`, {
	estadoNuevo,
  });
  return data?.instancia;
};

