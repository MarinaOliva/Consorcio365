const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ESTADOS_USUARIO, TIPOS_USUARIO } = require('../constants/estados');

const proveedorDetalleSchema = new mongoose.Schema({
  especialidad: { type: String, required: true, trim: true },
  direccion:    { type: String, required: true, trim: true },
  matricula:    { type: String, required: true, trim: true },
  tipoProveedor:{ type: String, required: true, trim: true },
  condicionFiscal:{ type: String, required: true, trim: true },
  // cuit_cuil:    { type: String, default: null, trim: true },
  razonSocial:  { type: String, default: null, trim: true }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },

  tipoDoc: {
    type: String,
    enum: ['DNI', 'CUIL', 'CUIT', 'PASAPORTE'],
    default: 'DNI'
  },

  numDoc: { type: String, default: null, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  passwordHash: { type: String, required: true },

  telefono: { type: String, default: null, trim: true },

  tipo: {
    type: String,
    required: true,
    enum: Object.values(TIPOS_USUARIO) 
  },

  estado: {
    type: String,
    enum: Object.values(ESTADOS_USUARIO), 
    default: ESTADOS_USUARIO.PENDIENTE
  },

  debeCambiarPassword: { type: Boolean, default: true },

  tokenRecuperacion: { type: String, default: null },
  expiracionToken:   { type: Date, default: null },

  proveedorDetalle: { type: proveedorDetalleSchema, default: null }
}, { timestamps: true });

// Validación por rol:

usuarioSchema.pre('validate', function () {
  if (this.email) this.email = this.email.toLowerCase().trim();

  if (this.tipo === TIPOS_USUARIO.OCUPANTE) {
    if (!this.numDoc) this.invalidate('numDoc', 'numDoc es requerido para ocupante');
    if (!this.telefono) this.invalidate('telefono', 'telefono es requerido para ocupante');
  }

  if (this.tipo === TIPOS_USUARIO.PROVEEDOR) {
    if (!this.numDoc) this.invalidate('numDoc', 'numDoc es requerido para proveedor');
    if (!this.telefono) this.invalidate('telefono', 'telefono es requerido para proveedor');
    if (!this.proveedorDetalle) this.invalidate('proveedorDetalle', 'proveedorDetalle es requerido para proveedor');
  }

  // si no es proveedor, limpiar detalle
  if (this.tipo !== TIPOS_USUARIO.PROVEEDOR && this.proveedorDetalle) {
    this.proveedorDetalle = null;
  }
});

/**
 * Hasheo automático al guardar si cambia passwordHash
 */
usuarioSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

usuarioSchema.methods.verificarPassword = function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.passwordHash);
};

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');