const { Schema, model, Types } = require('mongoose');

const equipoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del equipo es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  evento: {
    type: Types.ObjectId,
    ref: 'Evento',
  },
  categoria: {
    type: String,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
  },
}, {
  timestamps: true,
});

module.exports = model('Equipo', equipoSchema, 'equipos');
