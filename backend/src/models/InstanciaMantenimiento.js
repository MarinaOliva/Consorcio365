const mongoose = require('mongoose');

const instanciaMantenimientoSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanMantenimiento',
    required: true
  },
  fechaProgramada: { type: Date, required: true },
  estado: {
    type: String,
    enum: ['PROGRAMADA', 'EN_CURSO', 'CERRADA'],
    default: 'PROGRAMADA'
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('InstanciaMantenimiento', instanciaMantenimientoSchema, 'instanciasMantenimiento');