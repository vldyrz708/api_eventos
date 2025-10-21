const { Schema, model, Types } = require('mongoose');

const conferenciaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la conferencia es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha de la conferencia es obligatoria'],
  },
  ponentes: [{
    type: Types.ObjectId,
    ref: 'Ponente',
  }],
  imagen: {
    type: String,
    default: 'conferencia-default.jpg',
  },
  estado: {
    type: String,
    enum: ['programada', 'en_curso', 'finalizada', 'cancelada'],
    default: 'programada',
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

module.exports = model('Conferencia', conferenciaSchema, 'conferencias');
