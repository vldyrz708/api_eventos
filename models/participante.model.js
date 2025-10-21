const { Schema, model, Types } = require('mongoose');

const participanteSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    apellido: {
      type: String,
      trim: true,
    },
    nacimiento: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v <= new Date();
        },
        message: 'Fecha de nacimiento inválida',
      },
    },
    genero: {
      type: String,
      enum: ['masculino', 'femenino', 'otro'],
      default: 'otro',
    },
    // Referencias
    eventosCulturales: [{ type: Types.ObjectId, ref: 'EventoCultural' }],
    // Rol en el evento/equipo
    inscripcionFecha: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Participante', participanteSchema, 'participantes');
