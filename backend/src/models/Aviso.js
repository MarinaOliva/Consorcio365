const mongoose = require('mongoose');

const avisoSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  titulo:          { type: String, required: true, trim: true },
  cuerpo:          { type: String, required: true, trim: true },
  fechaPublicacion: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Aviso', avisoSchema);