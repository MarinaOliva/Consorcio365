const mongoose = require('mongoose');

const planMantenimientoSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  tarea:       { type: String, required: true, trim: true },
  especialidad: {
    type: String,
    enum: ['plomeria', 'electricidad', 'albanileria', 'ascensores',
           'cerrajeria', 'limpieza', 'jardineria', 'otro'],
    required: true
  },
  frecuencia: {
    type: String,
    enum: ['mensual', 'bimestral', 'trimestral', 'semestral', 'anual'],
    required: true
  },
  activo: { type: Boolean, default: true }
  // Estado: ACTIVO / INACTIVO → mapeado al campo `activo` (booleano)
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('PlanMantenimiento', planMantenimientoSchema, 'planesMantenimiento');