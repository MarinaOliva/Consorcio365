import api from "./api";

export const getTrabajos = async ({
  estado,
  incidenciaId,
  instanciaMantenimientoId,
  proveedorId,
} = {}) => {
  const params = new URLSearchParams();
  if (estado) params.append("estado", estado);
  if (incidenciaId) params.append("incidenciaId", incidenciaId);
  if (instanciaMantenimientoId) params.append("instanciaMantenimientoId", instanciaMantenimientoId);
  if (proveedorId) params.append("proveedorId", proveedorId);

  const qs = params.toString();
  const url = qs ? `/trabajos?${qs}` : "/trabajos";

  const { data } = await api.get(url);
  return data?.trabajos || [];
};

export const getTrabajo = async (id) => {
  const { data } = await api.get(`/trabajos/${id}`);
  return data?.trabajo;
};

export const createTrabajo = async (trabajo) => {
  const { data } = await api.post("/trabajos", trabajo);
  return data?.trabajo;
};

export const updateTrabajo = async (id, cambios) => {
  const { data } = await api.put(`/trabajos/${id}`, cambios);
  return data?.trabajo;
};

export const asignarProveedor = async (id, { proveedorId, monto }) => {
  const { data } = await api.patch(`/trabajos/${id}/asignar-proveedor`, {
	proveedorId,
	monto,
  });
  return data?.trabajo;
};

export const cambiarEstadoTrabajo = async (id, { estadoNuevo, observacion }) => {
  const { data } = await api.patch(`/trabajos/${id}/estado`, {
	estadoNuevo,
	observacion,
  });
  return data?.trabajo;
};

export const subirEvidencias = async (id, formData) => {
  const { data } = await api.post(`/trabajos/${id}/evidencias`, formData, {
	headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteTrabajo = async (id) => {
  const { data } = await api.delete(`/trabajos/${id}`);
  return data;
};

