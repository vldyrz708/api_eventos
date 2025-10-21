const Conferencia = require("../models/conferencia.model");
const { Types } = require("mongoose");

// Crear conferencia
const crearConferencia = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      fecha,
      ponentes,
      imagen,
      estado,
      metadata,
    } = req.body;
    if (!nombre || !fecha)
      return res
        .status(400)
        .json({ status: "error", message: "Nombre y fecha son obligatorios" });
    // Validar ponentes
    if (ponentes && Array.isArray(ponentes)) {
      for (const ponenteId of ponentes) {
        if (!Types.ObjectId.isValid(ponenteId)) {
          return res
            .status(400)
            .json({ status: "error", message: "ID de ponente inválido" });
        }
      }
    }
    const conferencia = new Conferencia({
      nombre,
      descripcion,
      fecha,
      ponentes,
      imagen,
      estado,
      metadata,
    });
    const guardado = await conferencia.save();
    return res
      .status(201)
      .json({
        status: "success",
        message: "Conferencia creada",
        data: guardado,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Listar conferencias (opcional por ponente)
const listarConferencias = async (req, res) => {
  try {
    const { ponenteId } = req.query;
    let filtro = {};
    if (ponenteId && Types.ObjectId.isValid(ponenteId)) {
      filtro.ponentes = ponenteId;
    }
    const conferencias = await Conferencia.find(filtro)
      .populate("ponentes", "nombre especialidad pais")
      .lean();
    return res.status(200).json({ status: "success", data: conferencias });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Obtener conferencia por ID
const conferenciaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const conferencia = await Conferencia.findById(id)
      .populate("ponentes", "nombre especialidad pais")
      .lean();
    if (!conferencia)
      return res
        .status(404)
        .json({ status: "error", message: "Conferencia no encontrada" });
    return res.status(200).json({ status: "success", data: conferencia });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Actualizar conferencia
const actualizarConferencia = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const conferencia = await Conferencia.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    })
      .populate("ponentes", "nombre especialidad pais")
      .lean();
    if (!conferencia)
      return res
        .status(404)
        .json({ status: "error", message: "Conferencia no encontrada" });
    return res.status(200).json({ status: "success", data: conferencia });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
  }
};

// Eliminar conferencia
const eliminarConferencia = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const conferencia = await Conferencia.findByIdAndDelete(id).lean();
    if (!conferencia)
      return res
        .status(404)
        .json({ status: "error", message: "Conferencia no encontrada" });
    return res
      .status(200)
      .json({
        status: "success",
        message: "Conferencia eliminada",
        data: conferencia,
      });
  } catch (error) {
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
  crearConferencia,
  listarConferencias,
  conferenciaPorId,
  actualizarConferencia,
  eliminarConferencia,
};
