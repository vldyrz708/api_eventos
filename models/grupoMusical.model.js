const { Schema, model, Types } = require('mongoose');

const grupoMusicalSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del grupo/banda es obligatorio'],
    trim: true,
  },
  genero: {
    type: String,
    trim: true,
  },
  pais: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  imagen: {
    type: String,
    default: 'grupo-default.jpg',
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = model('GrupoMusical', grupoMusicalSchema, 'gruposMusicales');
