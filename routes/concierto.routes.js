const express = require('express');
const router = express.Router();
const conciertoController = require('../controllers/concierto.controller');

router.post('/crear', conciertoController.crearConcierto);
router.get('/listar', conciertoController.listarConciertos);
router.get('/:id', conciertoController.conciertoPorId);
router.patch('/:id', conciertoController.actualizarConcierto);
router.delete('/:id', conciertoController.eliminarConcierto);

module.exports = router;
