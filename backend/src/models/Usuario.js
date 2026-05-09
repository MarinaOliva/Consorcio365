const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { ESTADOS_USUARIO, TIPOS_USUARIO } = require('../constants/estados');

const proveedorDetalleSchema = new mongoose.Schema({
  especialidad:    { type: String, required: true },
  matricula:       { type: String },
  tipoProveedor:   { type: String },
  condicionFiscal: { type: String },
  cuit_cuil:       { type: String },
  razonSocial:     { type: String }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  tipoDoc:  { type: String, enum: ['DNI', 'CUIL', 'CUIT', 'PASAPORTE'], default: 'DNI' },
  numDoc:   { type: String },
  email: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true
  },
  passwordHash: { type: String, required: true },
  telefono:     { type: String },
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
  tokenRecuperacion:   { type: String,  default: null },
  expiracionToken:     { type: Date,    default: null },
  proveedorDetalle:    { type: proveedorDetalleSchema, default: null }
}, {
  timestamps: true
});

usuarioSchema.pre('save', async function () {   
  if (!this.isModified('passwordHash')) return;  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

usuarioSchema.methods.verificarPassword = function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.passwordHash);
};

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');