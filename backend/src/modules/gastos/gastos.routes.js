const express = require('express');
const router = express.Router();

const ctrl = require('./gastos.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');
const { upload } = require('../../utils/upload');

router.use(auth);

// Listar y obtener: solo admin (libro contable)
router.get('/', roles('administrador'), ctrl.listar);
router.get('/:id', roles('administrador'), ctrl.obtener);

// Crear gasto MANUAL (admin)
router.post('/', roles('administrador'), upload.single('comprobante'), ctrl.crear);

// Editar gasto MANUAL (admin)
router.put('/:id', roles('administrador'), upload.single('comprobante'), ctrl.actualizar);

// Eliminar gasto (admin) - solo permite borrar MANUAL
router.delete('/:id', roles('administrador'), ctrl.eliminar);

module.exports = router;

