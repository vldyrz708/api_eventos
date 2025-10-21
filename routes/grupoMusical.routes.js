const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoMusical.controller');

router.post('/crear', grupoController.crearGrupo);
router.get('/listar', grupoController.listarGrupos);
router.get('/:id', grupoController.grupoPorId);
router.patch('/:id', grupoController.actualizarGrupo);
router.delete('/:id', grupoController.eliminarGrupo);

module.exports = router;
