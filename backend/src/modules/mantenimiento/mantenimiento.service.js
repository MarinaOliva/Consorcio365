const PlanMantenimiento = require('../../models/PlanMantenimiento');
const InstanciaMantenimiento = require('../../models/InstanciaMantenimiento');
const Edificio = require('../../models/Edificio');
const Trabajo = require('../../models/Trabajo');
const { ESTADOS_INSTANCIA, ESTADOS_TRABAJO } = require('../../constants/estados');

const ESPECIALIDADES_VALIDAS = [
  'plomeria', 'electricidad', 'albanileria', 'ascensores',
  'cerrajeria', 'limpieza', 'jardineria', 'otro'
];

const FRECUENCIAS_VALIDAS = ['mensual', 'bimestral', 'trimestral', 'semestral', 'anual'];

const MESES_POR_FRECUENCIA = {
  mensual: 1,
  bimestral: 2,
  trimestral: 3,
  semestral: 6,
  anual: 12
};

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const calcularProximaFechaSugerida = async (plan) => {
  const meses = MESES_POR_FRECUENCIA[plan.frecuencia];
  if (!meses) return null;

  const ultimaInstancia = await InstanciaMantenimiento.findOne({ planId: plan._id })
	.sort({ fechaProgramada: -1 });

  const baseFecha = ultimaInstancia ? new Date(ultimaInstancia.fechaProgramada) : new Date();
  const proxima = new Date(baseFecha);
  proxima.setMonth(proxima.getMonth() + meses);
  return proxima;
};


// PLANES

const crearPlan = async (data) => {
  const { edificioId, tarea, especialidad, frecuencia } = data;

  if (!edificioId || !tarea || !especialidad || !frecuencia) {
	throw makeError(400, 'edificioId, tarea, especialidad y frecuencia son requeridos');
  }

  if (!ESPECIALIDADES_VALIDAS.includes(especialidad)) {
	throw makeError(400, `especialidad inválida. Permitidas: ${ESPECIALIDADES_VALIDAS.join(', ')}`);
  }

  if (!FRECUENCIAS_VALIDAS.includes(frecuencia)) {
	throw makeError(400, `frecuencia inválida. Permitidas: ${FRECUENCIAS_VALIDAS.join(', ')}`);
  }

  const edificio = await Edificio.findById(edificioId);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  const plan = await PlanMantenimiento.create({
	edificioId,
	tarea: tarea.trim(),
	especialidad,
	frecuencia,
	activo: true
  });

  return { success: true, message: 'Plan creado correctamente', plan };
};

const listarPlanes = async (query) => {
  const { edificioId, especialidad, frecuencia, activo } = query;

  const filtro = {};
  if (edificioId) filtro.edificioId = edificioId;
  if (especialidad) filtro.especialidad = especialidad;
  if (frecuencia) filtro.frecuencia = frecuencia;
  if (activo !== undefined) filtro.activo = activo === 'true';

  const planes = await PlanMantenimiento.find(filtro)
	.populate('edificioId', 'nombre direccion')
	.sort({ createdAt: -1 });

  return { success: true, total: planes.length, planes };
};

// Detalle del plan + próxima fecha sugerida (sin guardar)
const obtenerPlan = async (id) => {
  const plan = await PlanMantenimiento.findById(id).populate('edificioId', 'nombre direccion');
  if (!plan) throw makeError(404, 'Plan no encontrado');

  const proximaFechaSugerida = plan.activo ? await calcularProximaFechaSugerida(plan) : null;

  // Últimas instancias para mostrar historial
  const ultimasInstancias = await InstanciaMantenimiento.find({ planId: plan._id })
	.sort({ fechaProgramada: -1 })
	.limit(5);

  return {
	success: true,
	plan,
	proximaFechaSugerida,
	ultimasInstancias
  };
};

const actualizarPlan = async (id, data) => {
  const plan = await PlanMantenimiento.findById(id);
  if (!plan) throw makeError(404, 'Plan no encontrado');

  const permitidos = ['tarea', 'especialidad', 'frecuencia', 'activo'];

  permitidos.forEach((campo) => {
	if (data[campo] !== undefined) plan[campo] = data[campo];
  });

  if (data.especialidad && !ESPECIALIDADES_VALIDAS.includes(data.especialidad)) {
	throw makeError(400, `especialidad inválida. Permitidas: ${ESPECIALIDADES_VALIDAS.join(', ')}`);
  }

  if (data.frecuencia && !FRECUENCIAS_VALIDAS.includes(data.frecuencia)) {
	throw makeError(400, `frecuencia inválida. Permitidas: ${FRECUENCIAS_VALIDAS.join(', ')}`);
  }

  await plan.save();
  return { success: true, plan };
};

// Desactivar plan (soft delete con activo: false)

const desactivarPlan = async (id) => {
  const plan = await PlanMantenimiento.findById(id);
  if (!plan) throw makeError(404, 'Plan no encontrado');

  const enCurso = await InstanciaMantenimiento.findOne({
	planId: plan._id,
	estado: ESTADOS_INSTANCIA.EN_CURSO
  });

  if (enCurso) {
	throw makeError(400, 'No se puede desactivar un plan con instancias EN_CURSO');
  }

  plan.activo = false;
  await plan.save();

  return { success: true, message: 'Plan desactivado correctamente' };
};


// INSTANCIAS

const crearInstancia = async (data) => {
  const { planId, fechaProgramada } = data;

  if (!planId) throw makeError(400, 'planId es requerido');

  const plan = await PlanMantenimiento.findById(planId);
  if (!plan) throw makeError(404, 'Plan no encontrado');

  if (!plan.activo) {
	throw makeError(400, 'No se puede crear una instancia desde un plan inactivo');
  }

  // Si no viene fecha, usar la sugerida
  const fecha = fechaProgramada ? new Date(fechaProgramada) : await calcularProximaFechaSugerida(plan);

  if (!fecha || isNaN(fecha.getTime())) {
	throw makeError(400, 'fechaProgramada inválida');
  }

  const instancia = await InstanciaMantenimiento.create({
	planId,
	fechaProgramada: fecha,
	estado: ESTADOS_INSTANCIA.PROGRAMADA
  });

  return { success: true, message: 'Instancia creada correctamente', instancia };
};

const listarInstancias = async (query) => {
  const { planId, estado, desde, hasta } = query;

  const filtro = {};
  if (planId) filtro.planId = planId;
  if (estado) filtro.estado = estado;
  if (desde || hasta) {
	filtro.fechaProgramada = {};
	if (desde) filtro.fechaProgramada.$gte = new Date(desde);
	if (hasta) filtro.fechaProgramada.$lte = new Date(hasta);
  }

  const instancias = await InstanciaMantenimiento.find(filtro)
	.populate({
  	path: 'planId',
  	select: 'tarea especialidad frecuencia activo edificioId',
  	populate: { path: 'edificioId', select: 'nombre' }
	})
	.sort({ fechaProgramada: -1 });

  return { success: true, total: instancias.length, instancias };
};

const obtenerInstancia = async (id) => {
  const instancia = await InstanciaMantenimiento.findById(id)
	.populate({
  	path: 'planId',
  	populate: { path: 'edificioId', select: 'nombre direccion' }
	});

  if (!instancia) throw makeError(404, 'Instancia no encontrada');

  // Trabajos asociados a esta instancia
  const trabajos = await Trabajo.find({ instanciaMantenimientoId: instancia._id })
	.populate('proveedorId', 'nombre apellido proveedorDetalle.especialidad')
	.sort({ createdAt: -1 });

  return { success: true, instancia, trabajos };
};

// Cambio manual de estado de instancia (solo admin)

const cambiarEstadoInstancia = async (id, data, usuario) => {
  const { estadoNuevo } = data;

  if (!estadoNuevo) throw makeError(400, 'estadoNuevo es requerido');
  if (!Object.values(ESTADOS_INSTANCIA).includes(estadoNuevo)) {
	throw makeError(400, `estadoNuevo inválido. Permitidos: ${Object.values(ESTADOS_INSTANCIA).join(', ')}`);
  }

  const instancia = await InstanciaMantenimiento.findById(id);
  if (!instancia) throw makeError(404, 'Instancia no encontrada');

  if (instancia.estado === ESTADOS_INSTANCIA.CERRADA) {
	throw makeError(400, 'No se puede cambiar el estado de una instancia ya CERRADA');
  }

  // Si se va a cerrar manualmente, validar que no haya trabajos en curso
  if (estadoNuevo === ESTADOS_INSTANCIA.CERRADA) {
	const trabajosAbiertos = await Trabajo.findOne({
  	instanciaMantenimientoId: instancia._id,
  	estado: { $nin: [ESTADOS_TRABAJO.CERRADO, ESTADOS_TRABAJO.CANCELADO] }
	});

	if (trabajosAbiertos) {
  	throw makeError(400, 'No se puede cerrar la instancia: hay trabajos abiertos asociados');
	}
  }

  instancia.estado = estadoNuevo;
  await instancia.save();

  return { success: true, instancia };
};

module.exports = {
  crearPlan,
  listarPlanes,
  obtenerPlan,
  actualizarPlan,
  desactivarPlan,
  crearInstancia,
  listarInstancias,
  obtenerInstancia,
  cambiarEstadoInstancia
};

