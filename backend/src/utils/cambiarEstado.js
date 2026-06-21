const cambiarEstado = (documento, estadoNuevo, usuarioId, observacion = '') => {
  if (!documento) throw new Error('Documento no encontrado');
  if (!estadoNuevo) throw new Error('estadoNuevo es requerido');
  if (!usuarioId) throw new Error('usuarioId es requerido');

  const estadoAnterior = documento.estado;

  // Si el estado no cambia, no hace nada
  if (estadoAnterior === estadoNuevo) return documento;

  documento.estado = estadoNuevo;

  if (!Array.isArray(documento.historialEstados)) {
	documento.historialEstados = [];
  }

  documento.historialEstados.push({
	estadoAnterior,
	estadoNuevo,
	creadoPorId: usuarioId,
	observacion,
	fecha: new Date()
  });

  return documento;
};

module.exports = cambiarEstado;


