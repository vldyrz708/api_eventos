const Evento = require('../models/eventosDeportivos.model');

const crearEvento = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      deporte,
      fecha,
      lugar,
      participantes,
      precio,
      imagen,
      estado
    } = req.body;

    if (!nombre || !descripcion || !deporte || !fecha || !lugar || !participantes || !precio) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan datos obligatorios: nombre y fecha',
      });
    }

    const nuevoEvento = new Evento({
      nombre,
      descripcion,
      deporte,
      fecha,
      lugar,
      participantes,
      precio,
      estado: estado || 'programado',
      imagen: imagen || 'evento-default.jpg',
    });

    const eventoGuardado = await nuevoEvento.save();
    return res.status(201).json({
      status: 'success',
      message: 'Evento creado con éxito',
      data: eventoGuardado,
    });
  } catch (error) {
    console.error('ERROR al crear evento', error);
    return res.status(500).json({ 
        status: 'error', 
        message: 'Error en el servidor', 
        error: error.message });
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().lean();
    return res.status(200).json({ 
        status: 'success', 
        message: 'Eventos obtenidos con éxito', 
        data: eventos });

  } catch (error) {
    console.error('ERROR al listar eventos', error);
    return res.status(500).json({ 
        status: 'error', 
        message: 'Error en el servidor', 
        error: error.message });
  }
};

const eventoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const eventoBuscado = await Evento.findById(id);

    if (!eventoBuscado) return res.status(404).json({ 
        status: 'error', 
        message: 'Evento no encontrado' 
    });

    return res.status(200).json({ 
        status: 'success', 
        message: 'Evento obtenido', 
        data: evento 
    });

  } catch (error) {
    console.error('ERROR al obtener evento por id', error);
    return res.status(500).json({ 
        status: 'error', 
        message: 'Error en el servidor', 
        error: error.message });
  }
};

const eliminarEvento = async (req, res) => {
  try {
    const id = req.params.id;
    const evento = await Evento.findByIdAndDelete(id);
    if (!evento) return res.status(404).json({ 
        status: 'error', 
        message: 'Evento no encontrado' 
    });
    return res.status(200).json({ 
        status: 'success', 
        message: 'Evento eliminado', 
        data: evento 
    });
  } catch (error) {
    console.error('ERROR al eliminar evento', error);
    return res.status(500).json({ 
        status: 'error', 
        message: 'Error en el servidor', 
        error: error.message });
  }
};

const actualizarEvento = async (req, res) => {
  try {
    const id = req.params.id;
    const cambios = req.body;
    const evento = await Evento.findByIdAndUpdate(
        id, 
        cambios, { 
            new: true, 
            runValidators: true })
            .lean();
    if (!evento) 
      return res.status(404).json({ 
    status: 'error', 
    message: 'Evento no encontrado' 
  });

    return res.status(200).json({ 
      status: 'success', 
      message: 'Evento actualizado', 
      data: evento 
    });
  } catch (error) {
    console.error('ERROR al actualizar evento', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

module.exports = {
  crearEvento,
  listarEventos,
  eventoPorId,
  eliminarEvento,
  actualizarEvento,
};
