const express = require('express');
const router = express.Router();

const usuariosController = require('./usuarios.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

// Todas las rutas requieren JWT + ser administrador
router.use(auth, roles('administrador'));

router.post('/',       usuariosController.crear);
router.get('/',        usuariosController.listar);
router.get('/:id',     usuariosController.obtener);
router.put('/:id',     usuariosController.actualizar);
router.delete('/:id',  usuariosController.eliminar);

module.exports = router;