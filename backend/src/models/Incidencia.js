const mongoose = require('mongoose');
const { ESTADOS_INCIDENCIA } = require('../constants/estados');

const comentarioSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  texto: { type: String, required: true, trim: true },
  fecha: { type: Date, default: Date.now }
}, { _id: true });

const historialEstadoSchema = new mongoose.Schema({
  estadoAnterior: { type: String, required: true },
  estadoNuevo:    { type: String, required: true },
  creadoPorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  observacion: { type: String, default: '' },
  fecha: { type: Date, default: Date.now }
}, { _id: true });

const incidenciaSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  espacio:   { type: String, trim: true },
  ocupanteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo:      { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  categoria: {
    type: String,
    enum: ['plomeria', 'electricidad', 'albanileria', 'ascensores',
           'cerrajeria', 'limpieza', 'jardineria', 'otro'],
    required: true
  },
  prioridad: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  estado: {
    type: String,
    enum: Object.values(ESTADOS_INCIDENCIA),
    default: ESTADOS_INCIDENCIA.ABIERTA
  },
  fotos: [{ type: String }],
  // Embebidos
  comentarios:      [comentarioSchema],
  historialEstados: [historialEstadoSchema]
}, {
  timestamps: true
});

incidenciaSchema.index({ edificioId: 1, estado: 1 });
incidenciaSchema.index({ ocupanteId: 1 });

module.exports = mongoose.model('Incidencia', incidenciaSchema);