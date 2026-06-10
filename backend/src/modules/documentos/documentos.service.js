const Documento = require('../../models/Documento');
const Edificio = require('../../models/Edificio');
const { subirACloudinary } = require('../../utils/upload');
const { TIPOS_USUARIO } = require('../../constants/estados');

const CATEGORIAS_VALIDAS = ['acta', 'reglamento', 'informe', 'plano', 'contrato', 'otro'];
const VISIBILIDADES_VALIDAS = ['todos', 'solo_ocupantes', 'solo_admin'];

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Verifica si un usuario puede ver un documento según su visibilidad.
const puedeVer = (usuario, visibilidad) => {
  if (visibilidad === 'todos') return true;
  if (visibilidad === 'solo_admin') return usuario.tipo === TIPOS_USUARIO.ADMINISTRADOR;
  if (visibilidad === 'solo_ocupantes') {
	return [TIPOS_USUARIO.ADMINISTRADOR, TIPOS_USUARIO.OCUPANTE].includes(usuario.tipo);
  }
  return false;
};

const crear = async (data, file) => {
  const { edificioId, nombre, categoria, visibilidad } = data;

  if (!edificioId || !nombre || !categoria) {
	throw makeError(400, 'edificioId, nombre y categoria son requeridos');
  }

  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
	throw makeError(400, `categoria inválida. Permitidas: ${CATEGORIAS_VALIDAS.join(', ')}`);
  }

  if (visibilidad && !VISIBILIDADES_VALIDAS.includes(visibilidad)) {
	throw makeError(400, `visibilidad inválida. Permitidas: ${VISIBILIDADES_VALIDAS.join(', ')}`);
  }

  if (!file) {
	throw makeError(400, 'El archivo es requerido');
  }

  const edificio = await Edificio.findById(edificioId);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  // Subir archivo a Cloudinary
  const result = await subirACloudinary(
	file.buffer,
	'consorcio365/documentos',
	file.mimetype,
	file.originalname
  );

  const documento = await Documento.create({
	edificioId,
	nombre: nombre.trim(),
	url: result.url,
	visibilidad: visibilidad || 'todos',
	categoria
  });

  return {
	success: true,
	message: 'Documento creado correctamente',
	documento
  };
};

const listar = async (query, usuario) => {
  const { edificioId, categoria, visibilidad } = query;

  const filtro = {};
  if (edificioId) filtro.edificioId = edificioId;
  if (categoria) filtro.categoria = categoria;
  if (visibilidad) filtro.visibilidad = visibilidad;

  // Filtrado automático por rol (no se ven docs que el usuario no puede ver)
  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	filtro.visibilidad = { $in: ['todos', 'solo_ocupantes'] };
  } else if (usuario.tipo === TIPOS_USUARIO.PROVEEDOR) {
	filtro.visibilidad = 'todos';
  }
  // admin ve todo (sin filtro extra)

  const documentos = await Documento.find(filtro)
	.populate('edificioId', 'nombre direccion')
	.sort({ createdAt: -1 });

  return { success: true, total: documentos.length, documentos };
};

const obtener = async (id, usuario) => {
  const documento = await Documento.findById(id)
	.populate('edificioId', 'nombre direccion');

  if (!documento) throw makeError(404, 'Documento no encontrado');

  if (!puedeVer(usuario, documento.visibilidad)) {
	throw makeError(403, 'No tenés permisos para ver este documento');
  }

  return { success: true, documento };
};

const actualizar = async (id, data, file) => {
  const documento = await Documento.findById(id);
  if (!documento) throw makeError(404, 'Documento no encontrado');

  const { nombre, categoria, visibilidad } = data;

  if (nombre !== undefined) {
	if (!nombre.trim()) throw makeError(400, 'nombre no puede estar vacío');
	documento.nombre = nombre.trim();
  }

  if (categoria !== undefined) {
	if (!CATEGORIAS_VALIDAS.includes(categoria)) {
  	throw makeError(400, `categoria inválida. Permitidas: ${CATEGORIAS_VALIDAS.join(', ')}`);
	}
	documento.categoria = categoria;
  }

  if (visibilidad !== undefined) {
	if (!VISIBILIDADES_VALIDAS.includes(visibilidad)) {
  	throw makeError(400, `visibilidad inválida. Permitidas: ${VISIBILIDADES_VALIDAS.join(', ')}`);
	}
	documento.visibilidad = visibilidad;
  }

  // Si vino un nuevo archivo, reemplazamos la URL
  if (file) {
	const result = await subirACloudinary(
  	file.buffer,
  	'consorcio365/documentos',
  	file.mimetype,
  	file.originalname
	);
	documento.url = result.url;
  }

  await documento.save();
  return { success: true, documento };
};

const eliminar = async (id) => {
  const documento = await Documento.findById(id);
  if (!documento) throw makeError(404, 'Documento no encontrado');

  await documento.deleteOne();

  return { success: true, message: 'Documento eliminado correctamente' };
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};

