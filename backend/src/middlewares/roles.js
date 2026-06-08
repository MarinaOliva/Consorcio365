// Uso: roles('ADMIN') o roles('ADMIN', 'OCUPANTE')
const roles = (...tiposPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ message: 'No tiene permisos para esta acción' });
    }

    next();
  };
};

module.exports = roles;
