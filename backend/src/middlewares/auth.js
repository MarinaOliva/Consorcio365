const { verifyToken } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token   = header.split(' ')[1];
    const decoded = verifyToken(token);

    const usuario = await Usuario.findById(decoded.id).select('-passwordHash');
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.usuario = usuario;   // queda disponible en todos los controllers
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
