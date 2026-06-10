const express = require('express');
const router = express.Router();

const ctrl = require('./mantenimiento.controller');
const auth = require('../../middlewares/auth');
const roles = require('../../middlewares/roles');

router.use(auth);

// Planes 
router.post('/planes', roles('administrador'), ctrl.crearPlan);
router.get('/planes', ctrl.listarPlanes);
router.get('/planes/:id', ctrl.obtenerPlan);
router.put('/planes/:id', roles('administrador'), ctrl.actualizarPlan);
router.delete('/planes/:id', roles('administrador'), ctrl.desactivarPlan);

// Instancias
router.post('/instancias', roles('administrador'), ctrl.crearInstancia);
router.get('/instancias', ctrl.listarInstancias);
router.get('/instancias/:id', ctrl.obtenerInstancia);
router.patch('/instancias/:id/estado', roles('administrador'), ctrl.cambiarEstadoInstancia);

module.exports = router;

