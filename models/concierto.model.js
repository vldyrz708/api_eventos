const { Schema, model, Types } = require('mongoose');

const conciertoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del concierto es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del concierto es obligatoria'],
  },
  gruposMusicales: [{
    type: Types.ObjectId,
    ref: 'GrupoMusical',
  }],
  imagen: {
    type: String,
    default: 'concierto-default.jpg',
  },
  estado: {
    type: String,
    enum: ['programado', 'en_curso', 'finalizado', 'cancelado'],
    default: 'programado',
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = model('Concierto', conciertoSchema, 'conciertos');
