const Usuario = require('../../models/Usuario');
const { TIPOS_USUARIO, ESTADOS_USUARIO } = require('../../constants/estados');

const TIPOS_DOC_VALIDOS = ['DNI', 'CUIL', 'CUIT', 'PASAPORTE'];

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const normalizarEmail = (email) => (email || '').toLowerCase().trim();

const validarEstado = (estado) => Object.values(ESTADOS_USUARIO).includes(estado);
const validarTipo   = (tipo) => Object.values(TIPOS_USUARIO).includes(tipo);

// Validaciones de creación y actualización se hacen en el servicio para asegurar coherencia por rol, ya que el modelo es compartido y no todos los campos son obligatorios para todos los tipos de usuario.
const validarCrear = (data) => {
  const {
    nombre, apellido, email, passwordTemporal, tipo,
    tipoDoc, numDoc, telefono,
    proveedorDetalle
  } = data;

  if (!nombre || !apellido || !email || !passwordTemporal || !tipo) {
    throw makeError(400, 'nombre, apellido, email, passwordTemporal y tipo son requeridos');
  }

  if (!validarTipo(tipo)) {
    throw makeError(400, `tipo inválido. Permitidos: ${Object.values(TIPOS_USUARIO).join(', ')}`);
  }

  // Password fuerte (como en auth)
  const okPass =
    passwordTemporal.length >= 8 &&
    /[A-Z]/.test(passwordTemporal) &&
    /[a-z]/.test(passwordTemporal) &&
    /[0-9]/.test(passwordTemporal) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordTemporal);

  if (!okPass) {
    throw makeError(
      400,
      'passwordTemporal debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
    );
  }

  // Reglas por rol
  if (tipo === TIPOS_USUARIO.OCUPANTE || tipo === TIPOS_USUARIO.PROVEEDOR) {
    if (!tipoDoc || !TIPOS_DOC_VALIDOS.includes(tipoDoc)) {
      throw makeError(400, `tipoDoc inválido. Permitidos: ${TIPOS_DOC_VALIDOS.join(', ')}`);
    }
    if (!numDoc) throw makeError(400, 'numDoc es requerido');
    if (!telefono) throw makeError(400, 'telefono es requerido');
  }

  if (tipo === TIPOS_USUARIO.PROVEEDOR) {
    if (!proveedorDetalle) throw makeError(400, 'proveedorDetalle es requerido para proveedor');

    const { especialidad, direccion, matricula, tipoProveedor, condicionFiscal } = proveedorDetalle;

    if (!tipoProveedor)   throw makeError(400, 'proveedorDetalle.tipoProveedor es requerido');
    if (!condicionFiscal) throw makeError(400, 'proveedorDetalle.condicionFiscal es requerido');
    if (!direccion)       throw makeError(400, 'proveedorDetalle.direccion es requerido');
    if (!especialidad)    throw makeError(400, 'proveedorDetalle.especialidad es requerido');
    if (!matricula)       throw makeError(400, 'proveedorDetalle.matricula es requerido');
  }
};

const crear = async (data) => {
  const emailNorm = normalizarEmail(data.email);

  validarCrear({ ...data, email: emailNorm });

  // Email duplicado
  const existe = await Usuario.findOne({ email: emailNorm });
  if (existe) throw makeError(409, 'Ya existe un usuario con ese email');

  const usuario = await Usuario.create({
    nombre: data.nombre,
    apellido: data.apellido,
    email: emailNorm,
    passwordHash: data.passwordTemporal,  // hook lo hashea

    tipo: data.tipo,
    estado: ESTADOS_USUARIO.PENDIENTE,    

    tipoDoc: data.tipoDoc || 'DNI',
    numDoc: data.numDoc || null,
    telefono: data.telefono || null,

    debeCambiarPassword: true,

    proveedorDetalle: data.tipo === TIPOS_USUARIO.PROVEEDOR ? data.proveedorDetalle : null
  });

  const { passwordHash, tokenRecuperacion, expiracionToken, ...usuarioLimpio } = usuario.toObject();

  return {
    success: true,
    message: 'Usuario creado correctamente',
    usuario: usuarioLimpio
  };
};

const listar = async (query) => {
  const { tipo, estado } = query;

  const filtro = {};
  if (tipo) filtro.tipo = tipo;
  if (estado) filtro.estado = estado;

  const usuarios = await Usuario.find(filtro)
    .select('-passwordHash -tokenRecuperacion -expiracionToken')
    .sort({ createdAt: -1 });

  return { success: true, total: usuarios.length, usuarios };
};

const obtener = async (id) => {
  const usuario = await Usuario.findById(id)
    .select('-passwordHash -tokenRecuperacion -expiracionToken');

  if (!usuario) throw makeError(404, 'Usuario no encontrado');

  return { success: true, usuario };
};

// actualización de datos
const actualizar = async (id, data) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) throw makeError(404, 'Usuario no encontrado');

  if (data.email !== undefined && normalizarEmail(data.email) !== usuario.email) {
    throw makeError(400, 'No se permite cambiar el email del usuario');
  }

  const permitidos = [
    'nombre', 'apellido', 'telefono', 'tipoDoc', 'numDoc',
    'tipo', 'estado', 'proveedorDetalle',
    'debeCambiarPassword'
  ];

  permitidos.forEach((campo) => {
    if (data[campo] !== undefined) usuario[campo] = data[campo];
  });

  if (data.tipo !== undefined && !validarTipo(usuario.tipo)) {
    throw makeError(400, `tipo inválido. Permitidos: ${Object.values(TIPOS_USUARIO).join(', ')}`);
  }
  if (data.estado !== undefined && !validarEstado(usuario.estado)) {
    throw makeError(400, `estado inválido. Permitidos: ${Object.values(ESTADOS_USUARIO).join(', ')}`);
  }

  // Coherencia por rol
  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
    if (!usuario.tipoDoc || !TIPOS_DOC_VALIDOS.includes(usuario.tipoDoc)) {
      throw makeError(400, `tipoDoc inválido. Permitidos: ${TIPOS_DOC_VALIDOS.join(', ')}`);
    }
    if (!usuario.numDoc) throw makeError(400, 'numDoc es requerido para ocupante');
    if (!usuario.telefono) throw makeError(400, 'telefono es requerido para ocupante');
    usuario.proveedorDetalle = null;
  }

  if (usuario.tipo === TIPOS_USUARIO.PROVEEDOR) {
    if (!usuario.tipoDoc || !TIPOS_DOC_VALIDOS.includes(usuario.tipoDoc)) {
      throw makeError(400, `tipoDoc inválido. Permitidos: ${TIPOS_DOC_VALIDOS.join(', ')}`);
    }
    if (!usuario.numDoc) throw makeError(400, 'numDoc es requerido para proveedor');
    if (!usuario.telefono) throw makeError(400, 'telefono es requerido para proveedor');

    if (!usuario.proveedorDetalle) throw makeError(400, 'proveedorDetalle es requerido para proveedor');
    const { especialidad, direccion, matricula, tipoProveedor, condicionFiscal } = usuario.proveedorDetalle;

    if (!tipoProveedor)   throw makeError(400, 'proveedorDetalle.tipoProveedor es requerido');
    if (!condicionFiscal) throw makeError(400, 'proveedorDetalle.condicionFiscal es requerido');
    if (!direccion)       throw makeError(400, 'proveedorDetalle.direccion es requerido');
    if (!especialidad)    throw makeError(400, 'proveedorDetalle.especialidad es requerido');
    if (!matricula)       throw makeError(400, 'proveedorDetalle.matricula es requerido');
  }

  if (usuario.tipo === TIPOS_USUARIO.ADMINISTRADOR) {
    usuario.proveedorDetalle = null;
  }

  await usuario.save();

  const { passwordHash, tokenRecuperacion, expiracionToken, ...usuarioLimpio } = usuario.toObject();

  return { success: true, usuario: usuarioLimpio };
};

const eliminar = async (id) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) throw makeError(404, 'Usuario no encontrado');

  usuario.estado = ESTADOS_USUARIO.INACTIVO;
  await usuario.save();

  return { success: true, message: 'Usuario desactivado' };
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};