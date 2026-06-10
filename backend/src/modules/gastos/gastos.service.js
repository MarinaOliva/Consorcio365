const Gasto = require('../../models/Gasto');
const Edificio = require('../../models/Edificio');
const { subirACloudinary } = require('../../utils/upload');
const { TIPOS_GASTO } = require('../../constants/estados');

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Listar gastos con filtros
const listar = async (query) => {
  const { edificioId, tipo, desde, hasta } = query;

  const filtro = {};
  if (edificioId) filtro.edificioId = edificioId;
  if (tipo) {
	if (!Object.values(TIPOS_GASTO).includes(tipo)) {
  	throw makeError(400, `tipo inválido. Permitidos: ${Object.values(TIPOS_GASTO).join(', ')}`);
	}
	filtro.tipo = tipo;
  }

  if (desde || hasta) {
	filtro.fecha = {};
	if (desde) filtro.fecha.$gte = new Date(desde);
	if (hasta) filtro.fecha.$lte = new Date(hasta);
  }

  const gastos = await Gasto.find(filtro)
	.populate('edificioId', 'nombre direccion')
	.populate({
  	path: 'trabajoId',
  	select: 'descripcion estado proveedorId incidenciaId instanciaMantenimientoId',
  	populate: [
    	{ path: 'proveedorId', select: 'nombre apellido proveedorDetalle.especialidad' },
    	{ path: 'incidenciaId', select: 'titulo categoria' },
    	{ path: 'instanciaMantenimientoId', select: 'fechaProgramada planId' }
  	]
	})
	.sort({ fecha: -1 });

  // Total acumulado
  const totalMonto = gastos.reduce((acc, g) => acc + (g.monto || 0), 0);

  return {
	success: true,
	total: gastos.length,
	totalMonto,
	gastos
  };
};

const obtener = async (id) => {
  const gasto = await Gasto.findById(id)
	.populate('edificioId', 'nombre direccion')
	.populate({
  	path: 'trabajoId',
  	populate: [
    	{ path: 'proveedorId', select: 'nombre apellido proveedorDetalle' },
    	{ path: 'incidenciaId', select: 'titulo descripcion categoria estado ocupanteId' },
    	{ path: 'instanciaMantenimientoId', select: 'fechaProgramada planId', populate: { path: 'planId', select: 'tarea especialidad' } }
  	]
	});

  if (!gasto) throw makeError(404, 'Gasto no encontrado');

  return { success: true, gasto };
};

/**
* Crear gasto MANUAL (sin cadena de trazabilidad)
*/
const crear = async (data, file) => {
  const { edificioId, monto, concepto, fecha } = data;

  if (!edificioId || !concepto) {
	throw makeError(400, 'edificioId y concepto son requeridos');
  }

  const montoNumerico = Number(monto);
  if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
	throw makeError(400, 'monto debe ser un número mayor a 0');
  }

  const edificio = await Edificio.findById(edificioId);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  // Subir comprobante si vino archivo
  let urlComprobante = null;
  if (file) {
		const result = await subirACloudinary(
    file.buffer, 
    'consorcio365/gastos', 
    file.mimetype,
    file.originalname);
	urlComprobante = result.url;
  }

  const gasto = await Gasto.create({
	edificioId,
	trabajoId: null,
	tipo: TIPOS_GASTO.MANUAL,
	monto: montoNumerico,
	concepto: concepto.trim(),
	comprobante: urlComprobante,
	fecha: fecha ? new Date(fecha) : new Date()
  });

  return {
	success: true,
	message: 'Gasto manual creado correctamente',
	gasto
  };
};

/**
* Editar gasto MANUAL
*/
const actualizar = async (id, data, file) => {
  const gasto = await Gasto.findById(id);
  if (!gasto) throw makeError(404, 'Gasto no encontrado');

  if (gasto.tipo !== TIPOS_GASTO.MANUAL) {
	throw makeError(400, 'Solo se pueden editar gastos manuales');
  }

  const { monto, concepto, fecha } = data;

  if (monto !== undefined) {
	const montoNumerico = Number(monto);
	if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
  	throw makeError(400, 'monto debe ser un número mayor a 0');
	}
	gasto.monto = montoNumerico;
  }

  if (concepto !== undefined) {
	if (!concepto.trim()) throw makeError(400, 'concepto no puede estar vacío');
	gasto.concepto = concepto.trim();
  }

  if (fecha !== undefined) gasto.fecha = new Date(fecha);

  if (file) {
	const result = await subirACloudinary(
    file.buffer, 
    'consorcio365/gastos', 
    file.mimetype,
    file.originalname);
	gasto.comprobante = result.url;
  }

  await gasto.save();

  return { success: true, gasto };
};

/**
* Eliminar gasto MANUAL
*/
const eliminar = async (id) => {
  const gasto = await Gasto.findById(id);
  if (!gasto) throw makeError(404, 'Gasto no encontrado');

  if (gasto.tipo !== TIPOS_GASTO.MANUAL) {
	throw makeError(400, 'Solo se pueden eliminar gastos manuales. Los gastos automáticos están ligados al cierre de su trabajo.');
  }

  await gasto.deleteOne();

  return { success: true, message: 'Gasto eliminado correctamente' };
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};

