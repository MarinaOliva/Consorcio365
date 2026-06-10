const edificiosService = require('./edificios.service');

const listar = async (req, res, next) => {
  try {
    const result = await edificiosService.listar();
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const result = await edificiosService.obtener(req.params.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const result = await edificiosService.actualizar(req.params.id, req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listar,
  obtener,
  actualizar
};