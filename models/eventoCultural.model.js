const { Schema, model, Types } = require('mongoose');

const eventoCulturalSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del evento es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  tipo: {
    type: String,
    enum: ['teatro', 'danza', 'arte', 'literatura', 'cine', 'otro'],
    default: 'otro',
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del evento es obligatoria'],
  },
  lugar: {
    nombre: { type: String, trim: true },
    direccion: { type: String, trim: true },
    ciudad: { type: String, trim: true },
    pais: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  participantes: [{
    type: Types.ObjectId,
    ref: 'Participante',
  }],
  imagen: {
    type: String,
    default: 'evento-cultural-default.jpg',
  },
  estado: {
    type: String,
    enum: ['programado', 'en_curso', 'finalizado', 'cancelado'],
    default: 'programado',
  },
}, {
  timestamps: true,
});

module.exports = model('EventoCultural', eventoCulturalSchema, 'culturales');
