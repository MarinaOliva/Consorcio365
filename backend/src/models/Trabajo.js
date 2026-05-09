const mongoose = require('mongoose');
const { ESTADOS_TRABAJO, TIPOS_GASTO } = require('../constants/estados');

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

// El gasto se genera automáticamente al cerrar el trabajo y se embebe acá para trazabilidad inmediata
const gastoSchema = new mongoose.Schema({
  monto:      { type: Number, required: true, min: 0 },
  concepto:   { type: String, required: true, trim: true },
  tipo: {
    type: String,
    enum: Object.values(TIPOS_GASTO),
    required: true
  },
  comprobante: { type: String, default: null },
  fecha:       { type: Date, default: Date.now }
}, { _id: true });

const trabajoSchema = new mongoose.Schema({
  // Origen: uno solo de los dos tiene valor, el otro es null
  incidenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incidencia',
    default: null
  },
  instanciaMantenimientoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstanciaMantenimiento',
    default: null
  },
  proveedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  descripcion:  { type: String, required: true, trim: true },
  monto:        { type: Number, min: 0, default: 0 },
  archivoPres:  { type: String, default: null },
  evidencias:   [{ type: String }],
  estado: {
    type: String,
    enum: Object.values(ESTADOS_TRABAJO),
    default: ESTADOS_TRABAJO.CREADO
  },
  // Embebidos
  historialEstados: [historialEstadoSchema],
  gasto:            { type: gastoSchema, default: null }
}, {
  timestamps: true
});

// Validación: debe tener exactamente un origen
trabajoSchema.pre('validate', async function () {
  const tieneIncidencia = !!this.incidenciaId;
  const tieneInstancia  = !!this.instanciaMantenimientoId;
  if (tieneIncidencia === tieneInstancia) {
    throw new Error(
      'Un Trabajo debe tener exactamente un origen: incidenciaId O instanciaMantenimientoId'
    );
  }
});

trabajoSchema.index({ incidenciaId: 1, estado: 1 });
trabajoSchema.index({ instanciaMantenimientoId: 1 });
trabajoSchema.index({ proveedorId: 1, estado: 1 });

module.exports = mongoose.model('Trabajo', trabajoSchema);