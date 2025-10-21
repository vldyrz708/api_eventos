const EventoCultural = require("../models/eventoCultural.model");
const Participante = require("../models/participante.model");
const { Types } = require("mongoose");

// Crear evento cultural
const crearEventoCultural = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, fecha, lugar, participantes, imagen } =
      req.body;
    if (!nombre || !fecha) {
      return res
        .status(400)
        .json({ status: "error", message: "Nombre y fecha son obligatorios" });
    }
    const evento = new EventoCultural({
      nombre,
      descripcion,
      tipo,
      fecha,
      lugar,
      participantes,
      imagen,
    });
    const eventoGuardado = await evento.save();
    return res
      .status(201)
      .json({
        status: "success",
        message: "Evento cultural creado",
        data: eventoGuardado,
      });
  } catch (error) {
    console.error("ERROR al crear evento cultural:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Listar eventos culturales
const listarEventosCulturales = async (req, res) => {
  try {
    const { tipo } = req.query;
    let filtro = {};
    if (tipo) filtro.tipo = tipo;
    const eventos = await EventoCultural.find(filtro)
      .populate("participantes", "nombre email")
      .lean();
    return res.status(200).json({ status: "success", data: eventos });
  } catch (error) {
    console.error("ERROR al listar eventos culturales:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Obtener evento cultural por ID
const eventoCulturalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de evento inválido" });
    }
    const evento = await EventoCultural.findById(id)
      .populate("participantes", "nombre email")
      .lean();
    if (!evento) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    }
    return res.status(200).json({ status: "success", data: evento });
  } catch (error) {
    console.error("ERROR al obtener evento cultural:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Actualizar evento cultural
const actualizarEventoCultural = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de evento inválido" });
    }
    const evento = await EventoCultural.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    })
      .populate("participantes", "nombre email")
      .lean();
    if (!evento) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    }
    return res.status(200).json({ status: "success", data: evento });
  } catch (error) {
    console.error("ERROR al actualizar evento cultural:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Eliminar evento cultural
const eliminarEventoCultural = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de evento inválido" });
    }
    const evento = await EventoCultural.findByIdAndDelete(id).lean();
    if (!evento) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    }
    return res
      .status(200)
      .json({
        status: "success",
        message: "Evento cultural eliminado",
        data: evento,
      });
  } catch (error) {
    console.error("ERROR al eliminar evento cultural:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Añadir participante a evento cultural
const agregarParticipante = async (req, res) => {
  try {
    const { id } = req.params;
    const { participanteId } = req.body;
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(participanteId)
    ) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }
    const evento = await EventoCultural.findByIdAndUpdate(
      id,
      { $addToSet: { participantes: participanteId } },
      { new: true }
    ).populate("participantes", "nombre email");
    if (!evento) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    }
    // Actualizar referencia en participante
    await Participante.findByIdAndUpdate(participanteId, {
      eventoCultural: id,
    });
    return res.status(200).json({ status: "success", data: evento });
  } catch (error) {
    console.error("ERROR al agregar participante:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Quitar participante de evento cultural
const quitarParticipante = async (req, res) => {
  try {
    const { id } = req.params;
    const { participanteId } = req.body;
    if (
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(participanteId)
    ) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }
    const evento = await EventoCultural.findByIdAndUpdate(
      id,
      { $pull: { participantes: participanteId } },
      { new: true }
    ).populate("participantes", "nombre email");
    if (!evento) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    }
    // Quitar referencia en participante
    await Participante.findByIdAndUpdate(participanteId, {
      $unset: { eventoCultural: "" },
    });
    return res.status(200).json({ status: "success", data: evento });
  } catch (error) {
    console.error("ERROR al quitar participante:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

module.exports = {
  crearEventoCultural,
  listarEventosCulturales,
  eventoCulturalPorId,
  actualizarEventoCultural,
  eliminarEventoCultural,
  agregarParticipante,
  quitarParticipante,
};
