const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);

  const status  = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    success: false,
    message,
    // solo muestra el stack en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
