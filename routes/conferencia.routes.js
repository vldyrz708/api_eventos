const express = require('express');
const router = express.Router();
const conferenciaController = require('../controllers/conferencia.controller');

router.post('/crear', conferenciaController.crearConferencia);
router.get('/listar', conferenciaController.listarConferencias);
router.get('/:id', conferenciaController.conferenciaPorId);
router.patch('/:id', conferenciaController.actualizarConferencia);
router.delete('/:id', conferenciaController.eliminarConferencia);

module.exports = router;
