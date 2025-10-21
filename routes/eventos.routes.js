const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');

router.post('/crear', eventoController.crearEvento);
router.get('/listar', eventoController.listarEventos);
router.get('/:id', eventoController.eventoPorId);
router.delete('/:id', eventoController.eliminarEvento);
router.patch('/:id', eventoController.actualizarEvento);

module.exports = router;
