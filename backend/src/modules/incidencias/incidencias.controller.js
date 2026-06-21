const service = require('./incidencias.service');

const crear = async (req, res, next) => {
  try {
    const io = req.app.get('io'); // Socket.IO para emitir notificaciones
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

const cambiarEstado = async (req, res, next) => {
  try {
	const result = await service.cambiarEstado(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const agregarComentario = async (req, res, next) => {
  try {
	const result = await service.agregarComentario(req.params.id, req.body, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const subirFotos = async (req, res, next) => {
  try {
	const result = await service.subirFotos(req.params.id, req.files, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
	const result = await service.eliminar(req.params.id, req.usuario);
	return res.json(result);
  } catch (err) { next(err); }
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  cambiarEstado,
  agregarComentario,
  subirFotos,	
  eliminar
};
