const service = require('./unidades.service');

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

const actualizar = async (req, res, next) => {
  try {
	const result = await service.actualizar(req.params.id, req.body);
	return res.json(result);
  } catch (err) { next(err); }
};

const vincularOcupante = async (req, res, next) => {
  try {
	const result = await service.vincularOcupante(req.params.id, req.body);
	return res.json(result);
  } catch (err) { next(err); }
};

const desvincularOcupante = async (req, res, next) => {
  try {
	const result = await service.desvincularOcupante(
  	req.params.id,
  	req.params.relacionId
	);
	return res.json(result);
  } catch (err) { next(err); }
};

module.exports = {
  listar,
  obtener,
  actualizar,
  vincularOcupante,
  desvincularOcupante
};

