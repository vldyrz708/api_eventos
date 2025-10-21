const Equipo = require("../models/equipo.model");
const Evento = require("../models/eventosDeportivos.model");
const { Types } = require("mongoose");

// Crear equipo vinculado a evento deportivo
const crearEquipo = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, evento} = req.body;
    if (!nombre || !evento) {
      return res
        .status(400)
        .json({ status: "error", message: "Nombre y evento son obligatorios" });
    }
    if (!Types.ObjectId.isValid(evento)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de evento inválido" });
    }
    // Verificar que el evento existe
    const eventoDoc = await Evento.findById(evento);
    if (!eventoDoc) {
      return res
        .status(404)
        .json({ status: "error", message: "Evento deportivo no encontrado" });
    }
    const equipo = new Equipo({
      nombre,
      descripcion,
      categoria,
      evento,
    });
    const equipoGuardado = await equipo.save();
    // Agregar el equipo al evento
    eventoDoc.equipos.push(equipoGuardado._id);
    await eventoDoc.save();
    return res
      .status(201)
      .json({
        status: "success",
        message: "Equipo creado",
        data: equipoGuardado,
      });
  } catch (error) {
    console.error("ERROR al crear equipo:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Listar equipos (opcionalmente por evento)
const listarEquipos = async (req, res) => {
  try {
    const { evento } = req.query;
    let filtro = {};
    if (evento) {
      if (!Types.ObjectId.isValid(evento)) {
        return res
          .status(400)
          .json({ status: "error", message: "ID de evento inválido" });
      }
      filtro.evento = evento;
    }
    const equipos = await Equipo.find(filtro)
      .populate("evento", "nombre fecha")
      .lean();
    return res.status(200).json({ status: "success", data: equipos });
  } catch (error) {
    console.error("ERROR al listar equipos:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Obtener equipo por ID
const equipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de equipo inválido" });
    }
    const equipo = await Equipo.findById(id)
      .populate("evento", "nombre fecha")
      .lean();
    if (!equipo) {
      return res
        .status(404)
        .json({ status: "error", message: "Equipo no encontrado" });
    }
    return res.status(200).json({ status: "success", data: equipo });
  } catch (error) {
    console.error("ERROR al obtener equipo:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Actualizar equipo
const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de equipo inválido" });
    }
    const equipo = await Equipo.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    })
      .populate("evento", "nombre fecha")
      .lean();
    if (!equipo) {
      return res
        .status(404)
        .json({ status: "error", message: "Equipo no encontrado" });
    }
    return res.status(200).json({ status: "success", data: equipo });
  } catch (error) {
    console.error("ERROR al actualizar equipo:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Eliminar equipo
const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de equipo inválido" });
    }
    const equipo = await Equipo.findByIdAndDelete(id).lean();
    if (!equipo) {
      return res
        .status(404)
        .json({ status: "error", message: "Equipo no encontrado" });
    }
    // Quitar el equipo del evento
    await Evento.findByIdAndUpdate(equipo.evento, {
      $pull: { equipos: equipo._id },
    });
    return res
      .status(200)
      .json({ status: "success", message: "Equipo eliminado", data: equipo });
  } catch (error) {
    console.error("ERROR al eliminar equipo:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Añadir participante a equipo
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
    const equipo = await Equipo.findByIdAndUpdate(
      id,
      { $addToSet: { participantes: participanteId } },
      { new: true }
    ).populate("participantes", "nombre email");
    if (!equipo) {
      return res
        .status(404)
        .json({ status: "error", message: "Equipo no encontrado" });
    }
    return res.status(200).json({ status: "success", data: equipo });
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

// Quitar participante de equipo
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
    const equipo = await Equipo.findByIdAndUpdate(
      id,
      { $pull: { participantes: participanteId } },
      { new: true }
    ).populate("participantes", "nombre email");
    if (!equipo) {
      return res
        .status(404)
        .json({ status: "error", message: "Equipo no encontrado" });
    }
    return res.status(200).json({ status: "success", data: equipo });
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
  crearEquipo,
  listarEquipos,
  equipoPorId,
  actualizarEquipo,
  eliminarEquipo,
  agregarParticipante,
  quitarParticipante,
};
