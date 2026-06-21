const service = require('./mantenimiento.service');

// Planes
const crearPlan = async (req, res, next) => {
  try {
	const result = await service.crearPlan(req.body);
	return res.status(201).json(result);
  } catch (err) { next(err); }
};

const listarPlanes = async (req, res, next) => {
  try {
	const result = await service.listarPlanes(req.query);
	return res.json(result);
  } catch (err) { next(err); }
};

const obtenerPlan = async (req, res, next) => {
  try {
	const result = await service.obtenerPlan(req.params.id);
	return res.json(result);
  } catch (err) { next(err); }
};

const actualizarPlan = async (req, res, next) => {
  try {
	const result = await service.actualizarPlan(req.params.id, req.body);
	return res.json(result);
  } catch (err) { next(err); }
};

const desactivarPlan = async (req, res, next) => {
  try {
	const result = await service.desactivarPlan(req.params.id);
	return res.json(result);
  } catch (err) { next(err); }
};

// Instancias
const crearInstancia = async (req, res, next) => {
  try {
	const result = await service.crearInstancia(req.body);
	return res.status(201).json(result);
  } catch (err) { next(err); }
};

const listarInstancias = async (req, res, next) => {
  try {
	const result = await service.listarInstancias(req.query);
	return res.json(result);
  } catch (err) { next(err); }
};

const obtenerInstancia = async (req, res, next) => {
  try {
	const result = await service.obtenerInstancia(req.params.id);
	return res.json(result);
  } catch (err) { next(err); }
};

const cambiarEstadoInstancia = async (req, res, next) => {
  try {
	const result = await service.cambiarEstadoInstancia(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

module.exports = {
  crearPlan,
  listarPlanes,
  obtenerPlan,
  actualizarPlan,
  desactivarPlan,
  crearInstancia,
  listarInstancias,
  obtenerInstancia,
  cambiarEstadoInstancia
};

