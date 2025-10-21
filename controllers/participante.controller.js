const Participante = require("../models/participante.model");
const EventoCultural = require("../models/eventoCultural.model");
const { Types } = require("mongoose");

// Crear participante (para evento cultural opcional)
const crearParticipante = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      nacimiento,
      genero,
      eventosCulturales,
      metadata,
    } = req.body;
    if (!nombre)
      return res
        .status(400)
        .json({ status: "error", message: "El nombre es obligatorio" });

    // Validar eventosCulturales si se pasa
    let eventosValidos = [];
    if (Array.isArray(eventosCulturales)) {
      for (const eventoId of eventosCulturales) {
        if (!Types.ObjectId.isValid(eventoId)) {
          return res
            .status(400)
            .json({
              status: "error",
              message: `ID de evento cultural inválido: ${eventoId}`,
            });
        }
        const ev = await EventoCultural.findById(eventoId);
        if (!ev) {
          return res
            .status(404)
            .json({
              status: "error",
              message: `Evento cultural no encontrado: ${eventoId}`,
            });
        }
        eventosValidos.push(eventoId);
      }
    }

    const participante = new Participante({
      nombre,
      apellido,
      nacimiento,
      genero,
      eventosCulturales: eventosValidos,
      metadata,
    });
    const guardado = await participante.save();

    // Agregar referencia en cada evento cultural
    for (const eventoId of eventosValidos) {
      await EventoCultural.findByIdAndUpdate(eventoId, {
        $addToSet: { participantes: guardado._id },
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Participante creado",
      data: guardado,
    });
  } catch (error) {
    console.error("ERROR crearParticipante:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Listar participantes (opcional por evento cultural)
const listarParticipantes = async (req, res) => {
  try {
    const { eventoId } = req.query;
    const filtro = {};
    if (eventoId) {
      if (!Types.ObjectId.isValid(eventoId))
        return res
          .status(400)
          .json({ status: "error", message: "ID de evento inválido" });
      filtro.eventosCulturales = eventoId;
    }
    const participantes = await Participante.find(filtro).lean();
    return res.status(200).json({ status: "success", data: participantes });
  } catch (error) {
    console.error("ERROR listarParticipantes:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Obtener participante por id
const participantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const participante = await Participante.findById(id).lean();
    if (!participante)
      return res
        .status(404)
        .json({ status: "error", message: "Participante no encontrado" });
    return res.status(200).json({ status: "success", data: participante });
  } catch (error) {
    console.error("ERROR participantePorId:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Actualizar participante
const actualizarParticipante = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });

    // Si se intenta cambiar eventosCulturales, validar existencia
    if (cambios.eventosCulturales && Array.isArray(cambios.eventosCulturales)) {
      for (const eventoId of cambios.eventosCulturales) {
        if (!Types.ObjectId.isValid(eventoId)) {
          return res
            .status(400)
            .json({
              status: "error",
              message: `ID de evento cultural inválido: ${eventoId}`,
            });
        }
        const ev = await EventoCultural.findById(eventoId);
        if (!ev) {
          return res
            .status(404)
            .json({
              status: "error",
              message: `Evento cultural no encontrado: ${eventoId}`,
            });
        }
      }
    }

    const participante = await Participante.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    }).lean();
    if (!participante)
      return res
        .status(404)
        .json({ status: "error", message: "Participante no encontrado" });
    return res.status(200).json({ status: "success", data: participante });
  } catch (error) {
    console.error("ERROR actualizarParticipante:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Eliminar participante
const eliminarParticipante = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const participante = await Participante.findByIdAndDelete(id).lean();
    if (!participante)
      return res
        .status(404)
        .json({ status: "error", message: "Participante no encontrado" });
    // Quitar referencia en todos los eventos culturales
    if (
      participante.eventosCulturales &&
      participante.eventosCulturales.length > 0
    ) {
      for (const eventoId of participante.eventosCulturales) {
        await EventoCultural.findByIdAndUpdate(eventoId, {
          $pull: { participantes: participante._id },
        });
      }
    }
    return res.status(200).json({
      status: "success",
      message: "Participante eliminado",
      data: participante,
    });
  } catch (error) {
    console.error("ERROR eliminarParticipante:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Vincular participante a evento cultural
const vincularAEvento = async (req, res) => {
  try {
    const { id } = req.params; // participante id
    const { eventoId } = req.body;
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(eventoId))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const evento = await EventoCultural.findById(eventoId);
    if (!evento)
      return res
        .status(404)
        .json({ status: "error", message: "Evento cultural no encontrado" });
    // Agregar eventoId al array eventosCulturales del participante
    const participante = await Participante.findByIdAndUpdate(
      id,
      { $addToSet: { eventosCulturales: eventoId } },
      { new: true, runValidators: true }
    );
    if (!participante)
      return res
        .status(404)
        .json({ status: "error", message: "Participante no encontrado" });
    // agregar referencia en evento
    await EventoCultural.findByIdAndUpdate(eventoId, {
      $addToSet: { participantes: id },
    });
    return res.status(200).json({ status: "success", data: participante });
  } catch (error) {
    console.error("ERROR vincularAEvento:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Desvincular participante de evento cultural
const desvincularDeEvento = async (req, res) => {
  try {
    const { id } = req.params; // participante id
    const { eventoId } = req.body;
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(eventoId))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    // Quitar eventoId del array eventosCulturales del participante
    const participante = await Participante.findByIdAndUpdate(
      id,
      { $pull: { eventosCulturales: eventoId } },
      { new: true }
    );
    if (!participante)
      return res
        .status(404)
        .json({ status: "error", message: "Participante no encontrado" });
    await EventoCultural.findByIdAndUpdate(eventoId, {
      $pull: { participantes: id },
    });
    return res.status(200).json({ status: "success", data: participante });
  } catch (error) {
    console.error("ERROR desvincularDeEvento:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

module.exports = {
  crearParticipante,
  listarParticipantes,
  participantePorId,
  actualizarParticipante,
  eliminarParticipante,
  vincularAEvento,
  desvincularDeEvento,
};
