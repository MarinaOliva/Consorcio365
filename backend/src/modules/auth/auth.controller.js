const authService = require('./auth.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const recuperar = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.recuperar({ email });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, nuevaPassword } = req.body;
    const result = await authService.resetPassword({ token, nuevaPassword });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const cambiarPassword = async (req, res, next) => {
  try {
    // req.usuario lo pone el middleware auth.js
    const usuarioId = req.usuario._id;
    const { passwordActual, nuevaPassword } = req.body;

    const result = await authService.cambiarPassword({
      usuarioId,
      passwordActual,
      nuevaPassword
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  recuperar,
  resetPassword,
  cambiarPassword
};