import api from "./api";


// ADAPTADORES: front (UI) <-> back (API)

const TIPO_TO_ROLE = {
  administrador: "Administrador",
  ocupante: "Ocupante",
  proveedor: "Proveedor",
};

const ROLE_TO_TIPO = {
  Administrador: "administrador",
  Ocupante: "ocupante",
  Proveedor: "proveedor",
};

const ESTADO_TO_STATUS = {
  ACTIVO: "Activo",
  PENDIENTE: "Pendiente",
  INACTIVO: "Inactivo",
};

const STATUS_TO_ESTADO = {
  Activo: "ACTIVO",
  Pendiente: "PENDIENTE",
  Inactivo: "INACTIVO",
};

// Back -> Front 
const mapBackToFront = (u) => ({
  id: u.id || u._id,
  name: u.nombre || "",
  lastName: u.apellido || "",
  email: u.email || "",
  phone: u.telefono || "",
  docType: u.tipoDoc || "DNI",
  docNumber: u.numDoc || "",
  role: TIPO_TO_ROLE[(u.tipo || "").toLowerCase()] || u.tipo,
  status: ESTADO_TO_STATUS[u.estado] || u.estado,

  // Solo para proveedores
  address: u.proveedorDetalle?.direccion || "",
  specialty: u.proveedorDetalle?.especialidad || "",
  category: u.proveedorDetalle?.tipoProveedor || "",
  license: u.proveedorDetalle?.matricula || "",
  taxStatus: u.proveedorDetalle?.condicionFiscal || "",
  companyName: u.proveedorDetalle?.razonSocial || "",
});

// Front -> Back 
const mapFrontToBack = (f) => {
  const base = {
	nombre: f.name,
	apellido: f.lastName,
	email: f.email,
	telefono: f.phone,
	tipoDoc: f.docType,
	numDoc: f.docNumber,
	tipo: ROLE_TO_TIPO[f.role] || f.role,
	estado: STATUS_TO_ESTADO[f.status] || f.status,
  };

  if (f.role === "Proveedor") {
	base.proveedorDetalle = {
  	direccion: f.address,
  	especialidad: f.specialty,
  	tipoProveedor: f.category,
  	matricula: f.license,
  	condicionFiscal: f.taxStatus,
  	razonSocial: f.companyName,
	};
  }

  return base;
};

// ENDPOINTS

export const getUsuarios = async ({ tipo, estado } = {}) => {
  const params = new URLSearchParams();
  if (tipo && tipo !== "todos") params.append("tipo", tipo);
  if (estado && estado !== "todos") params.append("estado", estado);

  const qs = params.toString();
  const url = qs ? `/usuarios?${qs}` : "/usuarios";

  const { data } = await api.get(url);
  const list = Array.isArray(data) ? data : data?.usuarios || [];
  return list.map(mapBackToFront);
};

export const updateUsuario = async (id, frontData) => {
  const backData = mapFrontToBack(frontData);
  const { data } = await api.put(`/usuarios/${id}`, backData);
  return data;
};

export const deleteUsuario = async (id) => {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};

export const createUsuario = async (frontData, passwordTemporal = "Temporal123!") => {
  const backData = {
	...mapFrontToBack(frontData),
	passwordTemporal,
  };
  const { data } = await api.post("/usuarios", backData);
  return data;
};

