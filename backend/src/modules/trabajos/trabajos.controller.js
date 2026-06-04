const service = require('./trabajos.service');

const crear = async (req, res, next) => {
  try {
	const result = await service.crear(req.body, req.usuario, io);
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
	const result = await service.actualizar(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const asignarProveedor = async (req, res, next) => {
  try {
	const result = await service.asignarProveedor(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const cambiarEstado = async (req, res, next) => {
  try {
	const result = await service.cambiarEstado(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
	const result = await service.eliminar(req.params.id, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const subirEvidencias = async (req, res, next) => {
  try {
	const result = await service.subirEvidencias(req.params.id, req.files, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  asignarProveedor,
  cambiarEstado,
  subirEvidencias,
  eliminar
};

