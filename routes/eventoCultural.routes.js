const express = require('express');
const router = express.Router();
const eventoCulturalController = require('../controllers/eventoCultural.controller');

// CRUD
router.post('/crear', eventoCulturalController.crearEventoCultural);
router.get('/listar', eventoCulturalController.listarEventosCulturales);
router.get('/:id', eventoCulturalController.eventoCulturalPorId);
router.patch('/:id', eventoCulturalController.actualizarEventoCultural);
router.delete('/:id', eventoCulturalController.eliminarEventoCultural);

// Participantes en evento cultural
router.post('/:id/agregar-participante', eventoCulturalController.agregarParticipante);
router.post('/:id/quitar-participante', eventoCulturalController.quitarParticipante);

module.exports = router;
