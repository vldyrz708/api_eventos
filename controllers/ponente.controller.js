const Ponente = require("../models/ponente.model");
const { Types } = require("mongoose");

// Crear ponente
const crearPonente = async (req, res) => {
  try {
    const { nombre, especialidad, bio, pais, imagen, metadata } = req.body;
    if (!nombre)
      return res
        .status(400)
        .json({ status: "error", message: "El nombre es obligatorio" });
    const ponente = new Ponente({
      nombre,
      especialidad,
      bio,
      pais,
      imagen,
      metadata,
    });
    const guardado = await ponente.save();
    return res
      .status(201)
      .json({ status: "success", message: "Ponente creado", data: guardado });
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

// Listar ponentes
const listarPonentes = async (req, res) => {
  try {
    const ponentes = await Ponente.find().lean();
    return res.status(200).json({ status: "success", data: ponentes });
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

// Obtener ponente por ID
const ponentePorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const ponente = await Ponente.findById(id).lean();
    if (!ponente)
      return res
        .status(404)
        .json({ status: "error", message: "Ponente no encontrado" });
    return res.status(200).json({ status: "success", data: ponente });
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

// Actualizar ponente
const actualizarPonente = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const ponente = await Ponente.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    }).lean();
    if (!ponente)
      return res
        .status(404)
        .json({ status: "error", message: "Ponente no encontrado" });
    return res.status(200).json({ status: "success", data: ponente });
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

// Eliminar ponente
const eliminarPonente = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const ponente = await Ponente.findByIdAndDelete(id).lean();
    if (!ponente)
      return res
        .status(404)
        .json({ status: "error", message: "Ponente no encontrado" });
    return res
      .status(200)
      .json({ status: "success", message: "Ponente eliminado", data: ponente });
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
  crearPonente,
  listarPonentes,
  ponentePorId,
  actualizarPonente,
  eliminarPonente,
};
