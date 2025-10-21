const express = require('express');
const router = express.Router();
const participanteController = require('../controllers/participante.controller');

// Rutas CRUD básicas
router.post('/crear', participanteController.crearParticipante);
router.get('/listar', participanteController.listarParticipantes);
router.get('/:id', participanteController.participantePorId);
router.patch('/:id', participanteController.actualizarParticipante);
router.delete('/:id', participanteController.eliminarParticipante);

module.exports = router;