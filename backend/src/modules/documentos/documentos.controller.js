const service = require('./documentos.service');

const crear = async (req, res, next) => {
  try {
	const result = await service.crear(req.body, req.file);
	return res.status(201).json(result);
  } catch (err) { next(err); }
};

const listar = async (req, res, next) => {
  try {
	const result = await service.listar(req.query, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
	const result = await service.obtener(req.params.id, req.usuario);
	return res.json(result);
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
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};

