const { Schema, model } = require('mongoose');

const ponenteSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del ponente es obligatorio'],
    trim: true,
  },
  especialidad: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  pais: {
    type: String,
    trim: true,
  },
  imagen: {
    type: String,
    default: 'ponente-default.jpg',
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = model('Ponente', ponenteSchema, 'ponentes');
