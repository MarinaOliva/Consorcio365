const express = require('express');
const router = express.Router();

const ctrl = require('./incidencias.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');
const {upload} = require('../../utils/upload'); 

router.use(auth);

// Crear: ocupantes
router.post('/', roles('ocupante', 'administrador'), ctrl.crear);

// Listar y obtener
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

// Editar datos básicos
router.put('/:id', ctrl.actualizar);

// Cambio de estado: solo admin
router.patch('/:id/estado', roles('administrador'), ctrl.cambiarEstado);

// Comentarios
router.post('/:id/comentarios', ctrl.agregarComentario);

// Subir fotos (max 5 por incidencia)
router.post('/:id/fotos', upload.array('fotos', 5), ctrl.subirFotos);

// Eliminar (cancela vía cambio de estado)
router.delete('/:id', roles('administrador'), ctrl.eliminar);

module.exports = router;

