const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
  edificioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edificio',
    required: true
  },
  nombre: { type: String, required: true, trim: true },
  // URL del archivo en Cloudinary
  url:    { type: String, required: true },
  visibilidad: {
    type: String,
    enum: ['todos', 'solo_ocupantes', 'solo_admin'],
    default: 'todos'
  },
  categoria: {
    type: String,
    enum: ['acta', 'reglamento', 'informe', 'plano', 'contrato', 'otro'],
    required: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Documento', documentoSchema);