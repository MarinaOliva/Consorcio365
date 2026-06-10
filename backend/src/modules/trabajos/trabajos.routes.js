const express = require('express');
const router = express.Router();

const ctrl = require('./trabajos.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');
const { upload } = require('../../utils/upload'); 

router.use(auth);

// Crear: solo admin
router.post('/', roles('administrador'), ctrl.crear);

// Listar y obtener
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

// Editar datos básicos
router.put('/:id', roles('administrador'), ctrl.actualizar);

// Asignar proveedor: solo admin
router.patch('/:id/asignar-proveedor', roles('administrador'), ctrl.asignarProveedor);

// Cambio de estado: admin o el proveedor asignado 
router.patch('/:id/estado', ctrl.cambiarEstado);

// Subir evidencias (hasta 5 por request)
router.post('/:id/evidencias', upload.array('evidencias', 5), ctrl.subirEvidencias);

// Eliminar (soft delete con CANCELADO)
router.delete('/:id', roles('administrador'), ctrl.eliminar);

module.exports = router;

