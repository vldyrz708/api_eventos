const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipo.controller');

// CRUD
router.post('/crear', equipoController.crearEquipo);
router.get('/listar', equipoController.listarEquipos);
router.get('/:id', equipoController.equipoPorId);
router.patch('/:id', equipoController.actualizarEquipo);
router.delete('/:id', equipoController.eliminarEquipo);

// Participantes en equipo
router.post('/:id/agregar-participante', equipoController.agregarParticipante);
router.post('/:id/quitar-participante', equipoController.quitarParticipante);

module.exports = router;
