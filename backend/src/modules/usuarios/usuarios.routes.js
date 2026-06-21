const express = require('express');
const router = express.Router();

const usuariosController = require('./usuarios.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

// Todas las rutas requieren JWT
router.use(auth);

// Solo ADMIN: crear, listar, obtener, eliminar
router.post('/',  	roles('administrador'), usuariosController.crear);
router.get('/',   	roles('administrador'), usuariosController.listar);
router.get('/:id',	roles('administrador'), usuariosController.obtener);
router.delete('/:id', roles('administrador'), usuariosController.eliminar);

// Editar: admin o el propio usuario (la validación está en el service)
router.put('/:id', roles('administrador', 'ocupante', 'proveedor'), usuariosController.actualizar);

module.exports = router;

