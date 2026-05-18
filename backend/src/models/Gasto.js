const mongoose = require('mongoose');
const { TIPOS_GASTO } = require('../constants/estados');

const gastoSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  trabajoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trabajo',
    default: null          // null cuando es MANUAL
  },
  tipo: {
    type: String,
    enum: Object.values(TIPOS_GASTO),
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  concepto: {
    type: String,
    required: true,
    trim: true
  },
  comprobante: {
    type: String,
    default: null           // URL Cloudinary
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

gastoSchema.index({ edificioId: 1, tipo: 1 });
gastoSchema.index({ trabajoId: 1 });

module.exports = mongoose.model('Gasto', gastoSchema);