const usuariosService = require('./usuarios.service');

const crear = async (req, res, next) => {
  try {
    const result = await usuariosService.crear(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const result = await usuariosService.listar(req.query);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const result = await usuariosService.obtener(req.params.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const result = await usuariosService.actualizar(req.params.id, req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const result = await usuariosService.eliminar(req.params.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};