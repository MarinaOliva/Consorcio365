const express = require('express');
const router = express.Router();

const ctrl = require('./avisos.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

router.use(auth);

// Crear/editar/borrar: solo admin
router.post('/', roles('administrador'), ctrl.crear);
router.put('/:id', roles('administrador'), ctrl.actualizar);
router.delete('/:id', roles('administrador'), ctrl.eliminar);

// Listar y ver: cualquier autenticado
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

module.exports = router;

