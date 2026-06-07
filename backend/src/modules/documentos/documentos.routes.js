const express = require('express');
const router = express.Router();

const ctrl = require('./documentos.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');
const { upload } = require('../../utils/upload');

router.use(auth);

// Crear/editar/borrar: solo admin
router.post('/', roles('administrador'), upload.single('archivo'), ctrl.crear);
router.put('/:id', roles('administrador'), upload.single('archivo'), ctrl.actualizar);
router.delete('/:id', roles('administrador'), ctrl.eliminar);

// Listar y ver: cualquier autenticado (con filtro por visibilidad)
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

module.exports = router;

