const service = require('./gastos.service');

const listar = async (req, res, next) => {
  try {
	const result = await service.listar(req.query);
	return res.json(result);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
	const result = await service.obtener(req.params.id);
	return res.json(result);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
	const result = await service.crear(req.body, req.file);
	return res.status(201).json(result);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
	const result = await service.actualizar(req.params.id, req.body, req.file);
	return res.json(result);
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
	const result = await service.eliminar(req.params.id);
	return res.json(result);
  } catch (err) { next(err); }
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};

