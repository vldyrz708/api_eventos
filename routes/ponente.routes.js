const express = require('express');
const router = express.Router();
const ponenteController = require('../controllers/ponente.controller');

router.post('/crear', ponenteController.crearPonente);
router.get('/listar', ponenteController.listarPonentes);
router.get('/:id', ponenteController.ponentePorId);
router.patch('/:id', ponenteController.actualizarPonente);
router.delete('/:id', ponenteController.eliminarPonente);

module.exports = router;
