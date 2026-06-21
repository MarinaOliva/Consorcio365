const Trabajo = require('../../models/Trabajo');
const Incidencia = require('../../models/Incidencia');
const InstanciaMantenimiento = require('../../models/InstanciaMantenimiento');
const Usuario = require('../../models/Usuario');
const Gasto = require('../../models/Gasto');
const { subirACloudinary } = require('../../utils/upload');
const cambiarEstadoHelper = require('../../utils/cambiarEstado');
const {
  ESTADOS_TRABAJO,
  ESTADOS_INCIDENCIA,
  ESTADOS_INSTANCIA,
  TIPOS_USUARIO,
  ESTADOS_USUARIO,
  TIPOS_GASTO
} = require('../../constants/estados');

// Transiciones de estado del Trabajo
const TRANSICIONES_VALIDAS = {
  CREADO:   	['ASIGNADO', 'CANCELADO'],
  ASIGNADO: 	['EN_EJECUCION', 'CANCELADO'],
  EN_EJECUCION: ['FINALIZADO', 'CANCELADO'],
  FINALIZADO:   ['CERRADO', 'EN_EJECUCION'],   // admin puede pedir correcciones
  CERRADO:  	[],
  CANCELADO:	[]
};

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Validar que el origen del trabajo sea correcto (incidencia o instancia, no ambos)
const validarOrigen = async (incidenciaId, instanciaMantenimientoId) => {
  const tieneInc = !!incidenciaId;
  const tieneInst = !!instanciaMantenimientoId;

  if (tieneInc === tieneInst) {
	throw makeError(400, 'Un Trabajo debe tener exactamente un origen: incidenciaId O instanciaMantenimientoId');
  }

  if (tieneInc) {
	const inc = await Incidencia.findById(incidenciaId);
	if (!inc) throw makeError(404, 'Incidencia no encontrada');
	if ([
  	ESTADOS_INCIDENCIA.CERRADA,
  	ESTADOS_INCIDENCIA.CANCELADA,
  	ESTADOS_INCIDENCIA.RECHAZADA
	].includes(inc.estado)) {
  	throw makeError(400, `No se puede crear un trabajo sobre una incidencia ${inc.estado}`);
	}
	return { incidencia: inc };
  }

  if (tieneInst) {
	const inst = await InstanciaMantenimiento.findById(instanciaMantenimientoId);
	if (!inst) throw makeError(404, 'InstanciaMantenimiento no encontrada');
	if (inst.estado === ESTADOS_INSTANCIA.CERRADA) {
  	throw makeError(400, 'No se puede crear un trabajo sobre una instancia CERRADA');
	}
	return { instancia: inst };
  }
};

// Crear trabajo (admin)

const crear = async (data, usuario) => {
  const {
	incidenciaId,
	instanciaMantenimientoId,
	proveedorId,
	descripcion,
	monto,
	archivoPres
  } = data;

  if (!descripcion) throw makeError(400, 'descripcion es requerida');
  if (monto !== undefined && (typeof monto !== 'number' || monto < 0)) {
	throw makeError(400, 'monto debe ser un número >= 0');
  }

  const origen = await validarOrigen(incidenciaId, instanciaMantenimientoId);

  let proveedor = null;
  if (proveedorId) {
	proveedor = await Usuario.findById(proveedorId);
	if (!proveedor) throw makeError(404, 'Proveedor no encontrado');
	if (proveedor.tipo !== TIPOS_USUARIO.PROVEEDOR) {
  	throw makeError(400, 'El usuario asignado debe ser de tipo proveedor');
	}
	if (proveedor.estado !== ESTADOS_USUARIO.ACTIVO) {
  	throw makeError(400, 'El proveedor debe estar ACTIVO');
	}
  }

  const estadoInicial = proveedorId ? ESTADOS_TRABAJO.ASIGNADO : ESTADOS_TRABAJO.CREADO;

  const trabajo = await Trabajo.create({
	incidenciaId: incidenciaId || null,
	instanciaMantenimientoId: instanciaMantenimientoId || null,
	proveedorId: proveedorId || null,
	descripcion,
	monto: monto || 0,
	archivoPres: archivoPres || null,
	evidencias: [],
	estado: estadoInicial,
	historialEstados: [
  	{
    	estadoAnterior: 'NUEVO',
    	estadoNuevo: estadoInicial,
    	creadoPorId: usuario._id,
    	observacion: proveedorId ? 'Trabajo creado y asignado al proveedor' : 'Trabajo creado sin proveedor',
    	fecha: new Date()
  	}
	]
  });

  // Side effects en el origen
  if (origen.incidencia && origen.incidencia.estado === ESTADOS_INCIDENCIA.ABIERTA) {
	cambiarEstadoHelper(origen.incidencia, ESTADOS_INCIDENCIA.EN_PROGRESO, usuario._id, 'Trabajo creado');
	await origen.incidencia.save();
  }

  return {
	success: true,
	message: 'Trabajo creado correctamente',
	trabajo
  };
};


// Listar trabajos (acorde al usuario)
const listar = async (query, usuario) => {
  const { estado, incidenciaId, instanciaMantenimientoId, proveedorId } = query;

  const filtro = {};
  if (estado) filtro.estado = estado;
  if (incidenciaId) filtro.incidenciaId = incidenciaId;
  if (instanciaMantenimientoId) filtro.instanciaMantenimientoId = instanciaMantenimientoId;
  if (proveedorId) filtro.proveedorId = proveedorId;

  if (usuario.tipo === TIPOS_USUARIO.PROVEEDOR) {
	filtro.proveedorId = usuario._id;
  }

  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	// Buscar las incidencias del ocupante
	const incidencias = await Incidencia.find({ ocupanteId: usuario._id }).select('_id');
	filtro.incidenciaId = { $in: incidencias.map((i) => i._id) };
  }

  const trabajos = await Trabajo.find(filtro)
	.populate('proveedorId', 'nombre apellido email proveedorDetalle.especialidad')
	.populate('incidenciaId', 'titulo categoria estado')
	.populate('instanciaMantenimientoId', 'fechaProgramada estado')
	.populate('historialEstados.creadoPorId', 'nombre apellido tipo')
	.sort({ createdAt: -1 });

  return { success: true, total: trabajos.length, trabajos };
};

const obtener = async (id, usuario) => {
  const trabajo = await Trabajo.findById(id)
	.populate('proveedorId', 'nombre apellido email telefono proveedorDetalle')
	.populate('incidenciaId', 'titulo descripcion categoria estado ocupanteId')
	.populate('instanciaMantenimientoId', 'fechaProgramada estado planId')
	.populate('historialEstados.creadoPorId', 'nombre apellido tipo');

  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  // Permisos
  if (usuario.tipo === TIPOS_USUARIO.PROVEEDOR) {
	if (!trabajo.proveedorId || trabajo.proveedorId._id.toString() !== usuario._id.toString()) {
  	throw makeError(403, 'No tiene permisos para ver este trabajo');
	}
  }

  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	if (
  	!trabajo.incidenciaId ||
  	trabajo.incidenciaId.ocupanteId.toString() !== usuario._id.toString()
	) {
  	throw makeError(403, 'No tiene permisos para ver este trabajo');
	}
  }

  return { success: true, trabajo };
};

// Editar datos básicos (solo admin)

const actualizar = async (id, data, usuario) => {
  const trabajo = await Trabajo.findById(id);
  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  if (trabajo.estado === ESTADOS_TRABAJO.CERRADO || trabajo.estado === ESTADOS_TRABAJO.CANCELADO) {
	throw makeError(400, `No se puede editar un trabajo ${trabajo.estado}`);
  }

  const permitidos = ['descripcion', 'monto', 'archivoPres'];

  permitidos.forEach((campo) => {
	if (data[campo] !== undefined) trabajo[campo] = data[campo];
  });

  if (data.monto !== undefined && (typeof data.monto !== 'number' || data.monto < 0)) {
	throw makeError(400, 'monto debe ser un número >= 0');
  }

  await trabajo.save();
  return { success: true, trabajo };
};

// Asignar proveedor (solo admin)

const asignarProveedor = async (id, data, usuario) => {
  const { proveedorId, monto } = data;

  if (!proveedorId) throw makeError(400, 'proveedorId es requerido');

  const trabajo = await Trabajo.findById(id);
  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  if (![ESTADOS_TRABAJO.CREADO, ESTADOS_TRABAJO.ASIGNADO].includes(trabajo.estado)) {
	throw makeError(400, `No se puede asignar proveedor a un trabajo ${trabajo.estado}`);
  }

  const proveedor = await Usuario.findById(proveedorId);
  if (!proveedor) throw makeError(404, 'Proveedor no encontrado');
  if (proveedor.tipo !== TIPOS_USUARIO.PROVEEDOR) {
	throw makeError(400, 'El usuario asignado debe ser de tipo proveedor');
  }
  if (proveedor.estado !== ESTADOS_USUARIO.ACTIVO) {
	throw makeError(400, 'El proveedor debe estar ACTIVO');
  }

  trabajo.proveedorId = proveedorId;
  if (monto !== undefined) {
	if (typeof monto !== 'number' || monto < 0) {
  	throw makeError(400, 'monto debe ser un número >= 0');
	}
	trabajo.monto = monto;
  }

  if (trabajo.estado === ESTADOS_TRABAJO.CREADO) {
	cambiarEstadoHelper(
  	trabajo,
  	ESTADOS_TRABAJO.ASIGNADO,
  	usuario._id,
  	`Proveedor asignado: ${proveedor.nombre} ${proveedor.apellido}`
	);
  } else {
	trabajo.historialEstados.push({
  	estadoAnterior: trabajo.estado,
  	estadoNuevo: trabajo.estado,
  	creadoPorId: usuario._id,
  	observacion: `Proveedor reasignado: ${proveedor.nombre} ${proveedor.apellido}`,
  	fecha: new Date()
	});
  }

  await trabajo.save();

  return { success: true, trabajo };
};



// Cambiar estado

const cambiarEstado = async (id, data, usuario) => {
  const { estadoNuevo, observacion } = data;

  if (!estadoNuevo) throw makeError(400, 'estadoNuevo es requerido');
  if (!Object.values(ESTADOS_TRABAJO).includes(estadoNuevo)) {
	throw makeError(400, `estadoNuevo inválido. Permitidos: ${Object.values(ESTADOS_TRABAJO).join(', ')}`);
  }

  const trabajo = await Trabajo.findById(id);
  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  // Permisos por rol
  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	throw makeError(403, 'No tiene permisos para cambiar el estado de un trabajo');
  }

  if (usuario.tipo === TIPOS_USUARIO.PROVEEDOR) {
	if (!trabajo.proveedorId || trabajo.proveedorId.toString() !== usuario._id.toString()) {
  	throw makeError(403, 'No tiene permisos sobre este trabajo');
	}
	const permitidoProveedor = {
  	ASIGNADO: 	['EN_EJECUCION'],
  	EN_EJECUCION: ['FINALIZADO']
	};
	const permitidos = permitidoProveedor[trabajo.estado] || [];
	if (!permitidos.includes(estadoNuevo)) {
  	throw makeError(
    	400,
    	`Como proveedor solo puede hacer las transiciones: ${Object.entries(permitidoProveedor).map(([k, v]) => `${k} → ${v.join('/')}`).join(', ')}`
  	);
	}
  }

  // Transiciones generales
  const permitidas = TRANSICIONES_VALIDAS[trabajo.estado] || [];
  if (!permitidas.includes(estadoNuevo)) {
	throw makeError(
  	400,
  	`No se permite la transición de ${trabajo.estado} a ${estadoNuevo}. Permitidas: ${permitidas.join(', ') || 'ninguna (estado final)'}`
	);
  }

  cambiarEstadoHelper(trabajo, estadoNuevo, usuario._id, observacion || '');
await trabajo.save();

// Side effect: al iniciar trabajo de mantenimiento, instancia pasa a EN_CURSO
if (
	estadoNuevo === ESTADOS_TRABAJO.EN_EJECUCION &&
	trabajo.instanciaMantenimientoId
) {
	const instancia = await InstanciaMantenimiento.findById(trabajo.instanciaMantenimientoId);
	if (instancia && instancia.estado === ESTADOS_INSTANCIA.PROGRAMADA) {
    	instancia.estado = ESTADOS_INSTANCIA.EN_CURSO;
    	await instancia.save();
	}
}

// Side effects al CERRAR
if (estadoNuevo === ESTADOS_TRABAJO.CERRADO) {
	await procesarCierreTrabajo(trabajo, usuario);
}

  return { success: true, trabajo };
};

const procesarCierreTrabajo = async (trabajo, usuario) => {
  let tipo = null;
  let concepto = '';
  let edificioId = null;

  // Determinar origen y datos
  if (trabajo.incidenciaId) {
	tipo = TIPOS_GASTO.CORRECTIVO;
	const inc = await Incidencia.findById(trabajo.incidenciaId);
	if (inc) {
  	edificioId = inc.edificioId;
  	concepto = `Trabajo correctivo: ${inc.titulo}`;

  	// Si la incidencia tiene todos sus trabajos cerrados, marcarla como RESUELTA
  	const trabajosDeIncidencia = await Trabajo.find({ incidenciaId: trabajo.incidenciaId });
  	const todosCerrados = trabajosDeIncidencia.every(
    	(t) => t.estado === ESTADOS_TRABAJO.CERRADO || t.estado === ESTADOS_TRABAJO.CANCELADO
  	);
  	const algunoCerrado = trabajosDeIncidencia.some(
    	(t) => t.estado === ESTADOS_TRABAJO.CERRADO
  	);

  	if (todosCerrados && algunoCerrado && inc.estado === ESTADOS_INCIDENCIA.EN_PROGRESO) {
    	cambiarEstadoHelper(
      	inc,
      	ESTADOS_INCIDENCIA.RESUELTA,
      	usuario._id,
      	'Todos los trabajos asociados están cerrados'
    	);
    	await inc.save();
  	}
	}
  } else if (trabajo.instanciaMantenimientoId) {
	tipo = TIPOS_GASTO.PREVENTIVO;
	const inst = await InstanciaMantenimiento.findById(trabajo.instanciaMantenimientoId)
  	.populate('planId');
	if (inst) {
  	edificioId = inst.planId?.edificioId;
  	concepto = `Mantenimiento preventivo: ${inst.planId?.tarea || 'Plan'} - ${new Date(inst.fechaProgramada).toLocaleDateString('es-AR')}`;

  	// Cerrar la instancia
  	if (inst.estado !== ESTADOS_INSTANCIA.CERRADA) {
    	inst.estado = ESTADOS_INSTANCIA.CERRADA;
    	await inst.save();
  	}
	}
  }

  // Generar gasto automático
  if (tipo && edificioId) {
	await Gasto.create({
  	edificioId,
  	trabajoId: trabajo._id,
  	tipo,
  	monto: trabajo.monto || 0,
  	concepto,
  	comprobante: trabajo.archivoPres || null,
  	fecha: new Date()
	});
  }
};

// Eliminar (soft delete: CANCELADO)

const eliminar = async (id, usuario) => {
  const trabajo = await Trabajo.findById(id);
  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  if ([ESTADOS_TRABAJO.CERRADO, ESTADOS_TRABAJO.CANCELADO].includes(trabajo.estado)) {
	throw makeError(400, `No se puede cancelar un trabajo ${trabajo.estado}`);
  }

  cambiarEstadoHelper(
	trabajo,
	ESTADOS_TRABAJO.CANCELADO,
	usuario._id,
	'Cancelado por administrador'
  );
  await trabajo.save();

  return { success: true, message: 'Trabajo cancelado' };
};

const subirEvidencias = async (id, files, usuario) => {
  if (!files || files.length === 0) {
	throw makeError(400, 'No se enviaron archivos');
  }

  const trabajo = await Trabajo.findById(id);
  if (!trabajo) throw makeError(404, 'Trabajo no encontrado');

  // Permisos: admin o el proveedor asignado
  if (usuario.tipo === TIPOS_USUARIO.OCUPANTE) {
	throw makeError(403, 'No tiene permisos para subir evidencias');
  }

  if (
	usuario.tipo === TIPOS_USUARIO.PROVEEDOR &&
	(!trabajo.proveedorId || trabajo.proveedorId.toString() !== usuario._id.toString())
  ) {
	throw makeError(403, 'No tiene permisos sobre este trabajo');
  }

  // No subir evidencias a trabajos cerrados/cancelados
  if ([ESTADOS_TRABAJO.CERRADO, ESTADOS_TRABAJO.CANCELADO].includes(trabajo.estado)) {
	throw makeError(400, `No se pueden subir evidencias a un trabajo ${trabajo.estado}`);
  }

  // Subir cada archivo a Cloudinary
  const urls = await Promise.all(
	files.map((file) => subirACloudinary(
		file.buffer, 
		'consorcio365/trabajos', 
		file.mimetype,
		file.originalname
  ))
);

  trabajo.evidencias.push(...urls.map((u) => u.url));
  await trabajo.save();

  return {
	success: true,
	message: `${urls.length} evidencia(s) subida(s) correctamente`,
	evidencias: trabajo.evidencias
  };
};


module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  asignarProveedor,
  cambiarEstado,
  subirEvidencias,
  eliminar
};

