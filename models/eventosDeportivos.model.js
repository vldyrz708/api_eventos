const { Schema, model } = require("mongoose");

// Esquema para eventos deportivos
const eventoSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del evento es obligatorio"],
            trim: true,
        },
        descripcion: {
            type: String,
            trim: true,
        },
        deporte: {
            type: String,
            enum: [
                "futbol",
                "baloncesto",
                "tenis",
                "ciclismo",
                "atletismo",
                "natacion",
                "otro",
            ],
            default: "otro",
        },
        fecha: {
            type: Date,
            required: [true, "La fecha del evento es obligatoria"],
        },
        lugar: {
            nombre: { type: String, trim: true },
            direccion: { type: String, trim: true },
            ciudad: { type: String, trim: true },
            pais: { type: String, trim: true },
            lat: { type: Number },
            lng: { type: Number },
        },
        participantes: {
            type: [String],
            default: [],
        },
        equipos: [{
            type: Schema.Types.ObjectId,
            ref: 'Equipo',
        }],
        precio: {
            type: Number,
            min: [0, "El precio no puede ser negativo"],
            default: 0,
        },
        imagen: {
            type: String,
            default: "evento-default.jpg",
        },
        estado: {
            type: String,
            enum: ["programado", "en_curso", "finalizado", "cancelado"],
            default: "programado",
        },
    },
);

module.exports = model("Evento", eventoSchema, "deportivos");