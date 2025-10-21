const GrupoMusical = require("../models/grupoMusical.model");
const { Types } = require("mongoose");

// Crear grupo/banda musical
const crearGrupo = async (req, res) => {
  try {
    const { nombre, genero, pais, descripcion, imagen, metadata } = req.body;
    if (!nombre)
      return res
        .status(400)
        .json({ status: "error", message: "El nombre es obligatorio" });
    const grupo = new GrupoMusical({
      nombre,
      genero,
      pais,
      descripcion,
      imagen,
      metadata,
    });
    const guardado = await grupo.save();
    return res
      .status(201)
      .json({
        status: "success",
        message: "Grupo musical creado",
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

// Listar grupos musicales
const listarGrupos = async (req, res) => {
  try {
    const grupos = await GrupoMusical.find().lean();
    return res.status(200).json({ status: "success", data: grupos });
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

// Obtener grupo por ID
const grupoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const grupo = await GrupoMusical.findById(id).lean();
    if (!grupo)
      return res
        .status(404)
        .json({ status: "error", message: "Grupo musical no encontrado" });
    return res.status(200).json({ status: "success", data: grupo });
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

// Actualizar grupo
const actualizarGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const grupo = await GrupoMusical.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    }).lean();
    if (!grupo)
      return res
        .status(404)
        .json({ status: "error", message: "Grupo musical no encontrado" });
    return res.status(200).json({ status: "success", data: grupo });
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

// Eliminar grupo
const eliminarGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const grupo = await GrupoMusical.findByIdAndDelete(id).lean();
    if (!grupo)
      return res
        .status(404)
        .json({ status: "error", message: "Grupo musical no encontrado" });
    return res
      .status(200)
      .json({
        status: "success",
        message: "Grupo musical eliminado",
        data: grupo,
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
  crearGrupo,
  listarGrupos,
  grupoPorId,
  actualizarGrupo,
  eliminarGrupo,
};
