const Concierto = require("../models/concierto.model");
const { Types } = require("mongoose");

// Crear concierto
const crearConcierto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      fecha,
      gruposMusicales,
      imagen,
      estado,
      metadata,
    } = req.body;
    if (!nombre || !fecha)
      return res
        .status(400)
        .json({ status: "error", message: "Nombre y fecha son obligatorios" });
    // Validar gruposMusicales
    if (gruposMusicales && Array.isArray(gruposMusicales)) {
      for (const grupoId of gruposMusicales) {
        if (!Types.ObjectId.isValid(grupoId)) {
          return res
            .status(400)
            .json({ status: "error", message: "ID de grupo musical inválido" });
        }
      }
    }
    const concierto = new Concierto({
      nombre,
      descripcion,
      fecha,
      gruposMusicales,
      imagen,
      estado,
      metadata,
    });
    const guardado = await concierto.save();
    return res
      .status(201)
      .json({ status: "success", message: "Concierto creado", data: guardado });
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

// Listar conciertos (opcional por grupo musical)
const listarConciertos = async (req, res) => {
  try {
    const { grupoId } = req.query;
    let filtro = {};
    if (grupoId && Types.ObjectId.isValid(grupoId)) {
      filtro.gruposMusicales = grupoId;
    }
    const conciertos = await Concierto.find(filtro)
      .populate("gruposMusicales", "nombre genero pais")
      .lean();
    return res.status(200).json({ status: "success", data: conciertos });
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

// Obtener concierto por ID
const conciertoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const concierto = await Concierto.findById(id)
      .populate("gruposMusicales", "nombre genero pais")
      .lean();
    if (!concierto)
      return res
        .status(404)
        .json({ status: "error", message: "Concierto no encontrado" });
    return res.status(200).json({ status: "success", data: concierto });
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

// Actualizar concierto
const actualizarConcierto = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const concierto = await Concierto.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    })
      .populate("gruposMusicales", "nombre genero pais")
      .lean();
    if (!concierto)
      return res
        .status(404)
        .json({ status: "error", message: "Concierto no encontrado" });
    return res.status(200).json({ status: "success", data: concierto });
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

// Eliminar concierto
const eliminarConcierto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ status: "error", message: "ID inválido" });
    const concierto = await Concierto.findByIdAndDelete(id).lean();
    if (!concierto)
      return res
        .status(404)
        .json({ status: "error", message: "Concierto no encontrado" });
    return res
      .status(200)
      .json({
        status: "success",
        message: "Concierto eliminado",
        data: concierto,
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
  crearConcierto,
  listarConciertos,
  conciertoPorId,
  actualizarConcierto,
  eliminarConcierto,
};
