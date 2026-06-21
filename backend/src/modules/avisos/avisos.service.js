const Aviso = require('../../models/Aviso');
const Edificio = require('../../models/Edificio');

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const crear = async (data, usuario) => {
  const { edificioId, titulo, cuerpo, fechaPublicacion } = data;

  if (!edificioId || !titulo || !cuerpo) {
	throw makeError(400, 'edificioId, titulo y cuerpo son requeridos');
  }

  const edificio = await Edificio.findById(edificioId);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  const aviso = await Aviso.create({
	edificioId,
	adminId: usuario._id,
	titulo: titulo.trim(),
	cuerpo: cuerpo.trim(),
	fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date()
  });

  return {
	success: true,
	message: 'Aviso publicado correctamente',
	aviso
  };
};

const listar = async (query) => {
  const { edificioId, desde, hasta } = query;

  const filtro = {};
  if (edificioId) filtro.edificioId = edificioId;
  if (desde || hasta) {
	filtro.fechaPublicacion = {};
	if (desde) filtro.fechaPublicacion.$gte = new Date(desde);
	if (hasta) filtro.fechaPublicacion.$lte = new Date(hasta);
  }

  const avisos = await Aviso.find(filtro)
	.populate('edificioId', 'nombre')
	.populate('adminId', 'nombre apellido')
	.sort({ fechaPublicacion: -1 });

  return { success: true, total: avisos.length, avisos };
};

const obtener = async (id) => {
  const aviso = await Aviso.findById(id)
	.populate('edificioId', 'nombre direccion')
	.populate('adminId', 'nombre apellido email');

  if (!aviso) throw makeError(404, 'Aviso no encontrado');

  return { success: true, aviso };
};

const actualizar = async (id, data) => {
  const aviso = await Aviso.findById(id);
  if (!aviso) throw makeError(404, 'Aviso no encontrado');

  const permitidos = ['titulo', 'cuerpo', 'fechaPublicacion'];

  permitidos.forEach((campo) => {
	if (data[campo] !== undefined) {
  	if (campo === 'fechaPublicacion') {
    	aviso[campo] = new Date(data[campo]);
  	} else {
    	aviso[campo] = typeof data[campo] === 'string' ? data[campo].trim() : data[campo];
  	}
	}
  });

  if (!aviso.titulo || !aviso.cuerpo) {
	throw makeError(400, 'titulo y cuerpo no pueden estar vacíos');
  }

  await aviso.save();
  return { success: true, aviso };
};

const eliminar = async (id) => {
  const aviso = await Aviso.findById(id);
  if (!aviso) throw makeError(404, 'Aviso no encontrado');

  await aviso.deleteOne();

  return { success: true, message: 'Aviso eliminado correctamente' };
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};


