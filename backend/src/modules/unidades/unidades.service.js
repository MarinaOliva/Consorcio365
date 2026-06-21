const Unidad = require('../../models/Unidad');
const Usuario = require('../../models/Usuario');
const {
  ESTADOS_UNIDAD,
  ESTADOS_UNIDAD_RELACION,
  ROLES_UNIDAD,
  TIPOS_USUARIO,
  ESTADOS_USUARIO
} = require('../../constants/estados');

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const validarEstadoUnidad = (estado) =>
  Object.values(ESTADOS_UNIDAD).includes(estado);

const validarRolUnidad = (rol) =>
  Object.values(ROLES_UNIDAD).includes(rol);

const tieneOcupantesActuales = (unidad) =>
  unidad.unidadRelaciones.some(
	(rel) =>
  	rel.esOcupanteActual === true &&
  	rel.estado === ESTADOS_UNIDAD_RELACION.VIGENTE
  );

const listar = async (query) => {
  const { edificioId, estado, piso, numero } = query;

  const filtro = {};
  if (edificioId) filtro.edificioId = edificioId;
  if (estado) filtro.estado = estado;
  if (piso) filtro.piso = piso;
  if (numero) filtro.numero = numero;

  const unidades = await Unidad.find(filtro)
	.populate('edificioId', 'nombre direccion')
	.populate('unidadRelaciones.ocupanteId', 'nombre apellido email tipo estado')
	.sort({ piso: 1, numero: 1 });

  return {
	success: true,
	total: unidades.length,
	unidades
  };
};

const obtener = async (id) => {
  const unidad = await Unidad.findById(id)
	.populate('edificioId', 'nombre direccion amenities')
	.populate('unidadRelaciones.ocupanteId', 'nombre apellido email telefono tipo estado');

  if (!unidad) throw makeError(404, 'Unidad no encontrada');

  return { success: true, unidad };
};

const actualizar = async (id, data) => {
  const unidad = await Unidad.findById(id);
  if (!unidad) throw makeError(404, 'Unidad no encontrada');

  const permitidos = ['numero', 'piso', 'estado', 'contactosEmergencia'];

  permitidos.forEach((campo) => {
	if (data[campo] !== undefined) unidad[campo] = data[campo];
  });

  if (!unidad.numero || !unidad.piso) {
	throw makeError(400, 'numero y piso son requeridos');
  }

  if (data.estado !== undefined) {
	if (!validarEstadoUnidad(unidad.estado)) {
  	throw makeError(
    	400,
    	`estado inválido. Permitidos: ${Object.values(ESTADOS_UNIDAD).join(', ')}`
  	);
	}

	const hayOcupantes = tieneOcupantesActuales(unidad);

	// Reglas de coherencia
	if (unidad.estado === ESTADOS_UNIDAD.VACIA && hayOcupantes) {
  	throw makeError(400, 'No se puede marcar la unidad como VACIA si tiene ocupantes actuales. Desvincule al ocupante primero.');
	}

	if (unidad.estado === ESTADOS_UNIDAD.OCUPADA && !hayOcupantes) {
  	throw makeError(400, 'No se puede marcar la unidad como OCUPADA si no tiene ocupantes actuales. Vincule un ocupante primero.');
	}

	if (unidad.estado === ESTADOS_UNIDAD.EN_REFACCION && hayOcupantes) {
  	throw makeError(400, 'No se puede marcar la unidad EN_REFACCION si tiene ocupantes actuales. Desvincule al ocupante primero.');
	}
  }

  if (
	data.contactosEmergencia !== undefined &&
	!Array.isArray(data.contactosEmergencia)
  ) {
	throw makeError(400, 'contactosEmergencia debe ser un array');
  }

  await unidad.save();
  return { success: true, unidad };
};


// Vincular un ocupante a la unidad
const vincularOcupante = async (unidadId, data) => {
  const { ocupanteId, rolEnUnidad, desde, esOcupanteActual } = data;

  if (!ocupanteId || !rolEnUnidad) {
	throw makeError(400, 'ocupanteId y rolEnUnidad son requeridos');
  }

  if (!validarRolUnidad(rolEnUnidad)) {
	throw makeError(
  	400,
  	`rolEnUnidad inválido. Permitidos: ${Object.values(ROLES_UNIDAD).join(', ')}`
	);
  }

  const unidad = await Unidad.findById(unidadId);
  if (!unidad) throw makeError(404, 'Unidad no encontrada');

  if (unidad.estado === ESTADOS_UNIDAD.EN_REFACCION) {
	throw makeError(400, 'No se puede vincular ocupantes a una unidad EN_REFACCION');
  }

  const usuario = await Usuario.findById(ocupanteId);
  if (!usuario) throw makeError(404, 'Usuario no encontrado');

  if (usuario.tipo !== TIPOS_USUARIO.OCUPANTE) {
	throw makeError(400, 'Solo se pueden vincular usuarios de tipo ocupante');
  }

  if (usuario.estado === ESTADOS_USUARIO.INACTIVO) {
	throw makeError(400, 'No se puede vincular un usuario INACTIVO');
  }

  // Evitar duplicar relación vigente
  const yaVinculado = unidad.unidadRelaciones.some(
	(rel) =>
  	rel.ocupanteId.toString() === ocupanteId &&
  	rel.esOcupanteActual === true &&
  	rel.estado === ESTADOS_UNIDAD_RELACION.VIGENTE
  );

  if (yaVinculado) {
	throw makeError(409, 'Ese ocupante ya está vinculado actualmente a esta unidad');
  }

  unidad.unidadRelaciones.push({
	ocupanteId,
	rolEnUnidad,
	esOcupanteActual: esOcupanteActual !== undefined ? !!esOcupanteActual : true,
	estado: ESTADOS_UNIDAD_RELACION.VIGENTE,
	desde: desde || new Date(),
	hasta: null
  });

  //Si se vincula alguien, la unidad pasa a OCUPADA
  unidad.estado = ESTADOS_UNIDAD.OCUPADA;

  await unidad.save();

  const unidadActualizada = await Unidad.findById(unidadId)
	.populate('edificioId', 'nombre direccion')
	.populate('unidadRelaciones.ocupanteId', 'nombre apellido email tipo estado');

  return {
	success: true,
	message: 'Ocupante vinculado correctamente',
	unidad: unidadActualizada
  };
};

// Desvincular ocupante
const desvincularOcupante = async (unidadId, relacionId) => {
  const unidad = await Unidad.findById(unidadId);
  if (!unidad) throw makeError(404, 'Unidad no encontrada');

  const relacion = unidad.unidadRelaciones.id(relacionId);
  if (!relacion) throw makeError(404, 'Relación de ocupante no encontrada');

  if (
	relacion.estado === ESTADOS_UNIDAD_RELACION.FINALIZADA ||
	relacion.esOcupanteActual === false
  ) {
	throw makeError(400, 'La relación ya está finalizada');
  }

  relacion.estado = ESTADOS_UNIDAD_RELACION.FINALIZADA;
  relacion.esOcupanteActual = false;
  relacion.hasta = new Date();

  // Si no quedan ocupantes actuales y la unidad estaba OCUPADA, pasa a VACIA
  const quedanActuales = unidad.unidadRelaciones.some(
	(rel) =>
  	rel._id.toString() !== relacionId &&
  	rel.esOcupanteActual === true &&
  	rel.estado === ESTADOS_UNIDAD_RELACION.VIGENTE
  );

  if (!quedanActuales && unidad.estado === ESTADOS_UNIDAD.OCUPADA) {
	unidad.estado = ESTADOS_UNIDAD.VACIA;
  }

  await unidad.save();

  const unidadActualizada = await Unidad.findById(unidadId)
	.populate('edificioId', 'nombre direccion')
	.populate('unidadRelaciones.ocupanteId', 'nombre apellido email tipo estado');

  return {
	success: true,
	message: 'Ocupante desvinculado correctamente',
	unidad: unidadActualizada
  };
};

module.exports = {
  listar,
  obtener,
  actualizar,
  vincularOcupante,
  desvincularOcupante
};

