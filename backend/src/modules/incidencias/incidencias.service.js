const Incidencia = require('../../models/Incidencia');
const Edificio = require('../../models/Edificio');
const cambiarEstadoHelper = require('../../utils/cambiarEstado');
const { ESTADOS_INCIDENCIA, TIPOS_USUARIO } = require('../../constants/estados');

const CATEGORIAS_VALIDAS = [
  'plomeria', 'electricidad', 'albanileria', 'ascensores',
  'cerrajeria', 'limpieza', 'jardineria', 'otro'
];

const PRIORIDADES_VALIDAS = ['alta', 'media', 'baja'];

/**
* Transiciones de estado permitidas
*/
const TRANSICIONES_VALIDAS = {
  ABIERTA: 	['EN_PROGRESO', 'RECHAZADA', 'CANCELADA'],
  EN_PROGRESO: ['RESUELTA', 'CANCELADA'],
  RESUELTA:	['CERRADA', 'EN_PROGRESO'],  // se puede reabrir
  CERRADA: 	[],
  RECHAZADA:   [],
  CANCELADA:   []
};

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

/**
* Crear incidencia (solo ocupantes)
* Se crea como ABIERTA.
*/
const crear = async (data, usuario, io) => {
  const { edificioId, espacio, titulo, descripcion, categoria, prioridad } = data;

  if (!edificioId || !titulo || !descripcion || !categoria) {
	throw makeError(400, 'edificioId, titulo, descripcion y categoria son requeridos');
  }

  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
	throw makeError(400, `categoria inválida. Permitidas: ${CATEGORIAS_VALIDAS.join(', ')}`);
  }

  if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
	throw makeError(400, `prioridad inválida. Permitidas: ${PRIORIDADES_VALIDAS.join(', ')}`);
  }

  const edificio = await Edificio.findById(edificioId);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  const incidencia = await Incidencia.create({
	edificioId,
	espacio: espacio || null,
	ocupanteId: usuario._id,
	titulo,
	descripcion,
	categoria,
	prioridad: prioridad || 'media',
	estado: ESTADOS_INCIDENCIA.ABIERTA,
	fotos: [],
	comentarios: [],
	historialEstados: []
  });

  // Emitir notificación al admin
  if (io) {
	io.to('tipo:administrador').emit('nueva-incidencia', {
  	_id: incidencia._id,
  	titulo: incidencia.titulo,
  	categoria: incidencia.categoria,
  	prioridad: incidencia.prioridad,
  	ocupante: `${usuario.nombre} ${usuario.apellido}`,
  	espacio: incidencia.espacio,
  	fecha: incidencia.createdAt
	});
  }

  return {
	success: true,
	message: 'Incidencia creada correctamente',
	incidencia
  };
};


/**
* Listar incidencias
* - Admin: ve todas
* - Ocupante: solo las suyas
* - Proveedor: ve todas (-- CAMBIAR DESPUES)
*/
const listar = async (query, usuario) => {
  const { estado, categoria, prioridad, edificioId } = query;

  const filtro = {};
  if (estado) filtro.estado = estado;
  if (categoria) filtro.categoria = categoria;
  if (prioridad) filtro.prioridad = prioridad;
  if (edificioId) filtro.edificioId = edificioId;

  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	filtro.ocupanteId = usuario._id;
  }

  const incidencias = await Incidencia.find(filtro)
	.populate('ocupanteId', 'nombre apellido email')
	.populate('edificioId', 'nombre direccion')
	.sort({ createdAt: -1 });

  return { success: true, total: incidencias.length, incidencias };
};

const obtener = async (id, usuario) => {
  const incidencia = await Incidencia.findById(id)
	.populate('ocupanteId', 'nombre apellido email telefono')
	.populate('edificioId', 'nombre direccion')
	.populate('comentarios.usuarioId', 'nombre apellido tipo')
	.populate('historialEstados.creadoPorId', 'nombre apellido tipo');

  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  // Ocupante solo ve las suyas
  if (
	usuario.tipo === TIPOS_USUARIO.OCUPANTE &&
	incidencia.ocupanteId._id.toString() !== usuario._id.toString()
  ) {
	throw makeError(403, 'No tenés permisos para ver esta incidencia');
  }

  return { success: true, incidencia };
};

/**
* Editar datos básicos
* - Admin: puede editar todo
* - Ocupante: solo las suyas y solo si están ABIERTAS
*/
const actualizar = async (id, data, usuario) => {
  const incidencia = await Incidencia.findById(id);
  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	if (incidencia.ocupanteId.toString() !== usuario._id.toString()) {
  	throw makeError(403, 'No tenés permisos para editar esta incidencia');
	}
	if (incidencia.estado !== ESTADOS_INCIDENCIA.ABIERTA) {
  	throw makeError(400, 'Solo podés editar incidencias ABIERTAS');
	}
  }

  const permitidos = ['titulo', 'descripcion', 'categoria', 'prioridad', 'espacio'];

  permitidos.forEach((campo) => {
	if (data[campo] !== undefined) incidencia[campo] = data[campo];
  });

  if (data.categoria && !CATEGORIAS_VALIDAS.includes(data.categoria)) {
	throw makeError(400, `categoria inválida. Permitidas: ${CATEGORIAS_VALIDAS.join(', ')}`);
  }
  if (data.prioridad && !PRIORIDADES_VALIDAS.includes(data.prioridad)) {
	throw makeError(400, `prioridad inválida. Permitidas: ${PRIORIDADES_VALIDAS.join(', ')}`);
  }

  await incidencia.save();
  return { success: true, incidencia };
};

/**
* Cambiar estado (solo admin).
* Valida transición y guarda en historialEstados[]
*/
const cambiarEstado = async (id, data, usuario) => {
  const { estadoNuevo, observacion } = data;

  if (!estadoNuevo) throw makeError(400, 'estadoNuevo es requerido');
  if (!Object.values(ESTADOS_INCIDENCIA).includes(estadoNuevo)) {
	throw makeError(
  	400,
  	`estadoNuevo inválido. Permitidos: ${Object.values(ESTADOS_INCIDENCIA).join(', ')}`
	);
  }

  const incidencia = await Incidencia.findById(id);
  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  const transicionesPermitidas = TRANSICIONES_VALIDAS[incidencia.estado] || [];
  if (!transicionesPermitidas.includes(estadoNuevo)) {
	throw makeError(
  	400,
  	`No se permite la transición de ${incidencia.estado} a ${estadoNuevo}. Permitidas desde ${incidencia.estado}: ${transicionesPermitidas.join(', ') || 'ninguna (estado final)'}`
	);
  }

  cambiarEstadoHelper(incidencia, estadoNuevo, usuario._id, observacion || '');
  await incidencia.save();

  return { success: true, incidencia };
};

/**
* Agregar comentario
* - Admin: en cualquier incidencia
* - Ocupante: solo en las suyas
*/
const agregarComentario = async (id, data, usuario) => {
  const { texto } = data;

  if (!texto || !texto.trim()) {
	throw makeError(400, 'texto del comentario es requerido');
  }

  const incidencia = await Incidencia.findById(id);
  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  if (
	usuario.tipo === TIPOS_USUARIO.OCUPANTE &&
	incidencia.ocupanteId.toString() !== usuario._id.toString()
  ) {
	throw makeError(403, 'No tenés permisos para comentar esta incidencia');
  }

  incidencia.comentarios.push({
	usuarioId: usuario._id,
	texto: texto.trim(),
	fecha: new Date()
  });

  await incidencia.save();
  return { success: true, incidencia };
};

/**
* Eliminar (soft delete: pasa a CANCELADA, queda en historial)
* Solo admin
*/
const eliminar = async (id, usuario) => {
  const incidencia = await Incidencia.findById(id);
  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  if (
	incidencia.estado === ESTADOS_INCIDENCIA.CERRADA ||
	incidencia.estado === ESTADOS_INCIDENCIA.CANCELADA
  ) {
	throw makeError(400, 'No se puede cancelar una incidencia ya cerrada o cancelada');
  }

  cambiarEstadoHelper(
	incidencia,
	ESTADOS_INCIDENCIA.CANCELADA,
	usuario._id,
	'Cancelada por administrador'
  );
  await incidencia.save();

  return { success: true, message: 'Incidencia cancelada' };
};

const { subirACloudinary } = require('../../utils/upload');

const subirFotos = async (id, files, usuario) => {
  if (!files || files.length === 0) {
	throw makeError(400, 'No se enviaron archivos');
  }

  const incidencia = await Incidencia.findById(id);
  if (!incidencia) throw makeError(404, 'Incidencia no encontrada');

  // Permisos: admin o el ocupante dueño
  if (
	usuario.tipo === TIPOS_USUARIO.OCUPANTE &&
	incidencia.ocupanteId.toString() !== usuario._id.toString()
  ) {
	throw makeError(403, 'No tenés permisos para subir fotos a esta incidencia');
  }

  // No subir fotos a incidencias ya cerradas/canceladas/rechazadas
  if ([
	ESTADOS_INCIDENCIA.CERRADA,
	ESTADOS_INCIDENCIA.CANCELADA,
	ESTADOS_INCIDENCIA.RECHAZADA
  ].includes(incidencia.estado)) {
	throw makeError(400, `No se pueden subir fotos a una incidencia ${incidencia.estado}`);
  }

  // Subir cada archivo a Cloudinary
  const urls = await Promise.all(
	files.map((file) => subirACloudinary(file.buffer, 'consorcio365/incidencias'))
  );

  // Guardamos solo las URLs
  incidencia.fotos.push(...urls.map((u) => u.url));
  await incidencia.save();

  return {
	success: true,
	message: `${urls.length} foto(s) subida(s) correctamente`,
	fotos: incidencia.fotos
  };
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

