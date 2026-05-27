const express = require('express');
const router = express.Router();

const controller = require('./unidades.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

router.use(auth);

// CRUD (sin crear ni eliminar — las unidades vienen precargadas)
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.put('/:id', roles('administrador'), controller.actualizar);

// Vincular / desvincular ocupante
router.post('/:id/vincular-ocupante', roles('administrador'), controller.vincularOcupante);
router.put('/:id/desvincular-ocupante/:relacionId', roles('administrador'), controller.desvincularOcupante);

module.exports = router;

