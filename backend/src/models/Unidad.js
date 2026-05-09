const mongoose = require('mongoose');
const {
  ESTADOS_UNIDAD,
  ESTADOS_UNIDAD_RELACION,
  ROLES_UNIDAD
} = require('../constants/estados');

// Subdocumento embebido: historial de quién vivió en la unidad
const unidadRelacionSchema = new mongoose.Schema({
  ocupanteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  rolEnUnidad: {
    type: String,
    enum: Object.values(ROLES_UNIDAD),
    required: true
  },
  esOcupanteActual: { type: Boolean, default: true },
  estado: {
    type: String,
    enum: Object.values(ESTADOS_UNIDAD_RELACION),
    default: ESTADOS_UNIDAD_RELACION.VIGENTE
  },
  desde: { type: Date, required: true, default: Date.now },
  hasta: { type: Date, default: null }
}, { _id: true, timestamps: false });

const unidadSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  numero: { type: String, required: true, trim: true },
  piso:   { type: String, required: true, trim: true },
  estado: {
    type: String,
    enum: Object.values(ESTADOS_UNIDAD),
    default: ESTADOS_UNIDAD.VACIA
  },
  contactosEmergencia: [{ type: String }],
  // Historial completo de ocupantes embebido
  unidadRelaciones: [unidadRelacionSchema]
}, {
  timestamps: true
});

unidadSchema.index({ edificioId: 1, numero: 1 }, { unique: true });

module.exports = mongoose.model('Unidad', unidadSchema, 'unidades');