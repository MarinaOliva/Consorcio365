const express = require('express');
const router = express.Router();

const edificiosController = require('./edificios.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

// Listar y obtener: cualquier usuario autenticado puede verlo
router.get('/',     auth, edificiosController.listar);
router.get('/:id',  auth, edificiosController.obtener);

// Solo admin puede editar
router.put('/:id',  auth, roles('administrador'), edificiosController.actualizar);

module.exports = router;