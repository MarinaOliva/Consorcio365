const mongoose = require('mongoose');

const edificioSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  // Lista de servicios: ['SUM', 'parrilla', 'gimnasio', 'pileta']
  amenities: [{ type: String }]
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Edificio', edificioSchema);