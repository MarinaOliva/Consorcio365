require('dotenv').config();
const mongoose = require('mongoose');

const connectDB  = require('../config/db');

const Usuario    = require('../models/Usuario');
const Edificio   = require('../models/Edificio');
const Unidad     = require('../models/Unidad');
const Incidencia = require('../models/Incidencia');
const Trabajo    = require('../models/Trabajo');
const PlanMantenimiento      = require('../models/PlanMantenimiento');
const InstanciaMantenimiento = require('../models/InstanciaMantenimiento');
const Aviso      = require('../models/Aviso');
const Documento  = require('../models/Documento');
const Gasto      = require('../models/Gasto');

const seed = async () => {
  await connectDB();

  // ── Limpiar ──────────────────────────────────────────────
  await Promise.all([
    Usuario.deleteMany({}),
    Edificio.deleteMany({}),
    Unidad.deleteMany({}),
    Incidencia.deleteMany({}),
    Trabajo.deleteMany({}),
    Gasto.deleteMany({}),
    PlanMantenimiento.deleteMany({}),
    InstanciaMantenimiento.deleteMany({}),
    Aviso.deleteMany({}),
    Documento.deleteMany({})
  ]);

  console.log('Colecciones limpiadas\n');

  // ── 1. EDIFICIO ───────────────────────────────────────────
  const edificio = await Edificio.create({
    nombre:    'Edificio Nexora',
    direccion: 'Av. Pellegrini 1234, Rosario',
    amenities: ['SUM', 'parrilla', 'gimnasio', 'pileta', 'lavandería']
  });
  console.log(`Edificio: ${edificio.nombre}`);

  // ── 2. USUARIOS ───────────────────────────────────────────
  // Admin
  const admin = await Usuario.create({
    nombre: 'Marina', apellido: 'Oliva',
    email: 'admin@consorcio365.com',
    passwordHash: 'Admin123!',
    tipo: 'administrador', estado: 'ACTIVO',
    debeCambiarPassword: false,
    telefono: '341-555-0001'
  });

  // Ocupantes 
  const ocupantesData = [
    {
      nombre: 'Juan', apellido: 'Pérez',
      email: 'juan@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0010',
      tipoDoc: 'DNI', numDoc: '30111222'
    },
    {
      nombre: 'Laura', apellido: 'Gómez',
      email: 'laura@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0011',
      tipoDoc: 'DNI', numDoc: '31222333'
    },
    {
      nombre: 'Roberto', apellido: 'Sánchez',
      email: 'roberto@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0012',
      tipoDoc: 'DNI', numDoc: '32333444'
    },
    {
      nombre: 'Valeria', apellido: 'Torres',
      email: 'valeria@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0013',
      tipoDoc: 'DNI', numDoc: '33444555'
    },
    {
      nombre: 'Diego', apellido: 'Fernández',
      email: 'diego@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0014',
      tipoDoc: 'DNI', numDoc: '34555666'
    },
    {
      nombre: 'Sofía', apellido: 'Ramírez',
      email: 'sofia@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'ocupante', estado: 'PENDIENTE',
      debeCambiarPassword: true, telefono: '341-555-0015',
      tipoDoc: 'DNI', numDoc: '35666777'
    }
  ];

  const [oc1, oc2, oc3, oc4, oc5, oc6] = await Promise.all(
    ocupantesData.map(data => Usuario.create(data))
  );

  // Proveedores 
  const proveedoresData = [
    {
      nombre: 'Carlos', apellido: 'López',
      email: 'carlos.plomero@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'proveedor', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0020',
      tipoDoc: 'CUIT', numDoc: '20-12345678-9',
      proveedorDetalle: {
        especialidad: 'plomeria',
        direccion: 'Av. Pellegrini 800, Rosario',
        matricula: 'MP-10001',
        tipoProveedor: 'Plomero',
        condicionFiscal: 'Monotributo',
        cuit_cuil: '20-12345678-9',
        razonSocial: 'López Plomería'
      }
    },
    {
      nombre: 'Marcelo', apellido: 'Ríos',
      email: 'marcelo.electrico@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'proveedor', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0021',
      tipoDoc: 'CUIT', numDoc: '20-87654321-0',
      proveedorDetalle: {
        especialidad: 'electricidad',
        direccion: 'Bv. Oroño 1500, Rosario',
        matricula: 'ME-20002',
        tipoProveedor: 'Electricista',
        condicionFiscal: 'Responsable Inscripto',
        cuit_cuil: '20-87654321-0',
        razonSocial: 'Ríos Electricidad SRL'
      }
    },
    {
      nombre: 'Hugo', apellido: 'Martínez',
      email: 'hugo.albanil@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'proveedor', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0022',
      tipoDoc: 'CUIT', numDoc: '20-11223344-5',
      proveedorDetalle: {
        especialidad: 'albanileria',
        direccion: 'Ovidio Lagos 2200, Rosario',
        matricula: 'MA-30003',
        tipoProveedor: 'Albañil',
        condicionFiscal: 'Monotributo',
        cuit_cuil: '20-11223344-5',
        razonSocial: 'Martínez Construcciones'
      }
    },
    {
      nombre: 'Pablo', apellido: 'Vega',
      email: 'pablo.ascensores@mail.com', passwordHash: 'Cambiar123!',
      tipo: 'proveedor', estado: 'ACTIVO',
      debeCambiarPassword: false, telefono: '341-555-0023',
      tipoDoc: 'CUIT', numDoc: '30-55667788-1',
      proveedorDetalle: {
        especialidad: 'ascensores',
        direccion: 'Av. Francia 3500, Rosario',
        matricula: 'MA-40004',
        tipoProveedor: 'Empresa de Ascensores',
        condicionFiscal: 'Responsable Inscripto',
        cuit_cuil: '30-55667788-1',
        razonSocial: 'Vega Ascensores SA'
      }
    }
  ];

  const [prov1, prov2, prov3, prov4] = await Promise.all(
    proveedoresData.map(data => Usuario.create(data))
  );

  console.log('Usuarios creados: 1 admin, 6 ocupantes, 4 proveedores');

  // ── 3. UNIDADES ───────────────────────────────────────────
  const unidades = await Unidad.insertMany([
    {
      edificioId: edificio._id, numero: '1A', piso: '1',
      estado: 'OCUPADA',
      contactosEmergencia: ['341-555-1001'],
      unidadRelaciones: [{
        ocupanteId: oc1._id, rolEnUnidad: 'PROPIETARIO',
        esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2022-03-01')
      }]
    },
    {
      edificioId: edificio._id, numero: '1B', piso: '1',
      estado: 'OCUPADA',
      contactosEmergencia: ['341-555-1002'],
      unidadRelaciones: [
        {
          ocupanteId: oc2._id, rolEnUnidad: 'PROPIETARIO',
          esOcupanteActual: false, estado: 'FINALIZADA',
          desde: new Date('2020-01-01'), hasta: new Date('2023-06-30')
        },
        {
          ocupanteId: oc3._id, rolEnUnidad: 'INQUILINO',
          esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2023-07-01')
        }
      ]
    },
    {
      edificioId: edificio._id, numero: '2A', piso: '2',
      estado: 'OCUPADA',
      unidadRelaciones: [{
        ocupanteId: oc2._id, rolEnUnidad: 'PROPIETARIO',
        esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2023-07-01')
      }]
    },
    {
      edificioId: edificio._id, numero: '2B', piso: '2',
      estado: 'OCUPADA',
      unidadRelaciones: [{
        ocupanteId: oc4._id, rolEnUnidad: 'PROPIETARIO',
        esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2021-05-15')
      }]
    },
    {
      edificioId: edificio._id, numero: '3A', piso: '3',
      estado: 'OCUPADA',
      unidadRelaciones: [{
        ocupanteId: oc5._id, rolEnUnidad: 'INQUILINO',
        esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2024-01-01')
      }]
    },
    {
      edificioId: edificio._id, numero: '3B', piso: '3',
      estado: 'EN_REFACCION',
      unidadRelaciones: []
    },
    {
      edificioId: edificio._id, numero: '4A', piso: '4',
      estado: 'VACIA',
      unidadRelaciones: []
    },
    {
      edificioId: edificio._id, numero: '4B', piso: '4',
      estado: 'OCUPADA',
      unidadRelaciones: [{
        ocupanteId: oc6._id, rolEnUnidad: 'PROPIETARIO',
        esOcupanteActual: true, estado: 'VIGENTE', desde: new Date('2024-06-01')
      }]
    }
  ]);

  console.log(`${unidades.length} unidades creadas`);

  // ── 4. INCIDENCIAS ────────────────────────────────────────
  const inc1 = await Incidencia.create({
    edificioId: edificio._id,
    espacio: 'Unidad 1A',
    ocupanteId: oc1._id,
    titulo: 'Pérdida de agua bajo el lavabo',
    descripcion: 'Hay agua acumulándose bajo el mueble del baño, parece una pérdida en la cañería.',
    categoria: 'plomeria', prioridad: 'alta', estado: 'CERRADA',
    fotos: [],
    comentarios: [
      { usuarioId: admin._id, texto: 'Revisamos el problema, vamos a asignar un plomero esta semana.', fecha: new Date('2024-11-02') },
      { usuarioId: oc1._id,   texto: 'Gracias, mientras tanto puse un balde para contener el agua.',  fecha: new Date('2024-11-02') }
    ],
    historialEstados: [
      { estadoAnterior: 'ABIERTA',      estadoNuevo: 'EN_PROGRESO', creadoPorId: admin._id, fecha: new Date('2024-11-02') },
      { estadoAnterior: 'EN_PROGRESO',  estadoNuevo: 'RESUELTA',    creadoPorId: admin._id, fecha: new Date('2024-11-05') },
      { estadoAnterior: 'RESUELTA',     estadoNuevo: 'CERRADA',     creadoPorId: admin._id, fecha: new Date('2024-11-06') }
    ],
    createdAt: new Date('2024-11-01')
  });

  const tInc1 = await Trabajo.create({
    incidenciaId: inc1._id,
    proveedorId: prov1._id,
    descripcion: 'Cambio de sello y reparación de cañería bajo lavabo',
    monto: 18000, estado: 'CERRADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',       estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id, fecha: new Date('2024-11-02') },
      { estadoAnterior: 'ASIGNADO',     estadoNuevo: 'EN_EJECUCION', creadoPorId: prov1._id, fecha: new Date('2024-11-04') },
      { estadoAnterior: 'EN_EJECUCION', estadoNuevo: 'FINALIZADO',   creadoPorId: prov1._id, fecha: new Date('2024-11-05') },
      { estadoAnterior: 'FINALIZADO',   estadoNuevo: 'CERRADO',      creadoPorId: admin._id, fecha: new Date('2024-11-06') }
    ],
    createdAt: new Date('2024-11-02')
  });

  await Gasto.create({
    edificioId: edificio._id, trabajoId: tInc1._id, tipo: 'CORRECTIVO',
    monto: 18000, concepto: 'Reparación pérdida cañería — Unidad 1A',
    comprobante: null, fecha: new Date('2024-11-06')
  });

  const inc2 = await Incidencia.create({
    edificioId: edificio._id,
    espacio: 'Pasillo piso 2',
    ocupanteId: oc4._id,
    titulo: 'Luz del pasillo piso 2 no funciona',
    descripcion: 'Desde hace 3 días la luz del pasillo del segundo piso no enciende.',
    categoria: 'electricidad', prioridad: 'media', estado: 'CERRADA',
    fotos: [], comentarios: [],
    historialEstados: [
      { estadoAnterior: 'ABIERTA',      estadoNuevo: 'EN_PROGRESO', creadoPorId: admin._id, fecha: new Date('2024-10-10') },
      { estadoAnterior: 'EN_PROGRESO',  estadoNuevo: 'RESUELTA',    creadoPorId: admin._id, fecha: new Date('2024-10-12') },
      { estadoAnterior: 'RESUELTA',     estadoNuevo: 'CERRADA',     creadoPorId: admin._id, fecha: new Date('2024-10-13') }
    ],
    createdAt: new Date('2024-10-09')
  });

  const tInc2 = await Trabajo.create({
    incidenciaId: inc2._id,
    proveedorId: prov2._id,
    descripcion: 'Reemplazo de llave térmica y cambio de luminaria pasillo piso 2',
    monto: 12500, estado: 'CERRADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',       estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id,  fecha: new Date('2024-10-10') },
      { estadoAnterior: 'ASIGNADO',     estadoNuevo: 'EN_EJECUCION', creadoPorId: prov2._id,  fecha: new Date('2024-10-11') },
      { estadoAnterior: 'EN_EJECUCION', estadoNuevo: 'FINALIZADO',   creadoPorId: prov2._id,  fecha: new Date('2024-10-12') },
      { estadoAnterior: 'FINALIZADO',   estadoNuevo: 'CERRADO',      creadoPorId: admin._id,  fecha: new Date('2024-10-13') }
    ],
    createdAt: new Date('2024-10-10')
  });

  await Gasto.create({
    edificioId: edificio._id, trabajoId: tInc2._id, tipo: 'CORRECTIVO',
    monto: 12500, concepto: 'Reparación eléctrica pasillo piso 2',
    comprobante: null, fecha: new Date('2024-10-13')
  });

  const inc3 = await Incidencia.create({
    edificioId: edificio._id,
    espacio: 'Terraza',
    ocupanteId: oc5._id,
    titulo: 'Humedad en el techo del 3A',
    descripcion: 'Aparecieron manchas de humedad en el cielorraso del dormitorio, parece filtración de la terraza.',
    categoria: 'albanileria', prioridad: 'alta', estado: 'EN_PROGRESO',
    fotos: [],
    comentarios: [
      { usuarioId: admin._id, texto: 'Ya subimos a revisar. Hay una junta rota en la terraza. Vamos a coordinar con el albañil.', fecha: new Date('2025-01-16') }
    ],
    historialEstados: [
      { estadoAnterior: 'ABIERTA', estadoNuevo: 'EN_PROGRESO', creadoPorId: admin._id, fecha: new Date('2025-01-16') }
    ],
    createdAt: new Date('2025-01-15')
  });

  await Trabajo.create({
    incidenciaId: inc3._id,
    proveedorId: prov3._id,
    descripcion: 'Impermeabilización de junta en terraza y reparación de cielorraso 3A',
    monto: 45000, estado: 'EN_EJECUCION', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',   estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id, fecha: new Date('2025-01-16') },
      { estadoAnterior: 'ASIGNADO', estadoNuevo: 'EN_EJECUCION', creadoPorId: prov3._id, fecha: new Date('2025-01-20') }
    ],
    createdAt: new Date('2025-01-16')
  });

  await Incidencia.create({
    edificioId: edificio._id, espacio: 'Hall de entrada', ocupanteId: oc2._id,
    titulo: 'Puerta de entrada no cierra bien',
    descripcion: 'La puerta principal del edificio no cierra correctamente, se necesita ajustar la cerradura.',
    categoria: 'cerrajeria', prioridad: 'alta', estado: 'ABIERTA',
    fotos: [], comentarios: [], historialEstados: [],
    createdAt: new Date('2025-04-01')
  });

  await Incidencia.create({
    edificioId: edificio._id, espacio: 'SUM', ocupanteId: oc3._id,
    titulo: 'Ventilador del SUM hace ruido',
    descripcion: 'El ventilador de techo del salón de usos múltiples hace un ruido molesto al girar.',
    categoria: 'electricidad', prioridad: 'baja', estado: 'ABIERTA',
    fotos: [], comentarios: [], historialEstados: [],
    createdAt: new Date('2025-04-10')
  });

  await Incidencia.create({
    edificioId: edificio._id, espacio: 'Unidad 2A', ocupanteId: oc2._id,
    titulo: 'Pintura del interior del departamento',
    descripcion: 'Quiero pintar el interior del departamento y solicito que el consorcio lo cubra.',
    categoria: 'albanileria', prioridad: 'baja', estado: 'RECHAZADA',
    fotos: [],
    comentarios: [
      { usuarioId: admin._id, texto: 'La pintura interior de los departamentos es responsabilidad del propietario, no del consorcio.', fecha: new Date('2024-09-22') }
    ],
    historialEstados: [
      { estadoAnterior: 'ABIERTA', estadoNuevo: 'RECHAZADA', creadoPorId: admin._id, fecha: new Date('2024-09-22') }
    ],
    createdAt: new Date('2024-09-21')
  });

  const inc7 = await Incidencia.create({
    edificioId: edificio._id, espacio: 'Cochera', ocupanteId: oc4._id,
    titulo: 'Lámpara de cochera fundida',
    descripcion: 'La luz de la cochera B no funciona desde hace una semana.',
    categoria: 'electricidad', prioridad: 'media', estado: 'RESUELTA',
    fotos: [], comentarios: [],
    historialEstados: [
      { estadoAnterior: 'ABIERTA',     estadoNuevo: 'EN_PROGRESO', creadoPorId: admin._id, fecha: new Date('2025-03-10') },
      { estadoAnterior: 'EN_PROGRESO', estadoNuevo: 'RESUELTA',    creadoPorId: admin._id, fecha: new Date('2025-03-12') }
    ],
    createdAt: new Date('2025-03-09')
  });

  await Trabajo.create({
    incidenciaId: inc7._id,
    proveedorId: prov2._id,
    descripcion: 'Cambio de lámpara y revisión del circuito en cochera',
    monto: 8500, estado: 'FINALIZADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',       estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id,  fecha: new Date('2025-03-10') },
      { estadoAnterior: 'ASIGNADO',     estadoNuevo: 'EN_EJECUCION', creadoPorId: prov2._id,  fecha: new Date('2025-03-11') },
      { estadoAnterior: 'EN_EJECUCION', estadoNuevo: 'FINALIZADO',   creadoPorId: prov2._id,  fecha: new Date('2025-03-12') }
    ],
    createdAt: new Date('2025-03-10')
  });

  console.log('7 incidencias creadas');

  // ── 5. PLANES E INSTANCIAS DE MANTENIMIENTO ───────────────
  const plan1 = await PlanMantenimiento.create({
    edificioId: edificio._id,
    tarea: 'Revisión y mantenimiento de ascensores',
    especialidad: 'ascensores', frecuencia: 'trimestral', activo: true
  });

  const inst1 = await InstanciaMantenimiento.create({
    planId: plan1._id, fechaProgramada: new Date('2025-01-15'),
    estado: 'CERRADA', createdAt: new Date('2025-01-01')
  });

  const tPrev1 = await Trabajo.create({
    instanciaMantenimientoId: inst1._id, proveedorId: prov4._id,
    descripcion: 'Revisión semestral de ascensor: lubricación, ajuste de cables y prueba de seguridad',
    monto: 35000, estado: 'CERRADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',       estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id,  fecha: new Date('2025-01-10') },
      { estadoAnterior: 'ASIGNADO',     estadoNuevo: 'EN_EJECUCION', creadoPorId: prov4._id,  fecha: new Date('2025-01-15') },
      { estadoAnterior: 'EN_EJECUCION', estadoNuevo: 'FINALIZADO',   creadoPorId: prov4._id,  fecha: new Date('2025-01-16') },
      { estadoAnterior: 'FINALIZADO',   estadoNuevo: 'CERRADO',      creadoPorId: admin._id,  fecha: new Date('2025-01-17') }
    ],
    createdAt: new Date('2025-01-10')
  });

  await Gasto.create({
    edificioId: edificio._id, trabajoId: tPrev1._id, tipo: 'PREVENTIVO',
    monto: 35000, concepto: 'Mantenimiento preventivo ascensor — Enero 2025',
    comprobante: null, fecha: new Date('2025-01-17')
  });

  const inst2 = await InstanciaMantenimiento.create({
    planId: plan1._id, fechaProgramada: new Date('2025-04-15'),
    estado: 'EN_CURSO', createdAt: new Date('2025-04-01')
  });

  await Trabajo.create({
    instanciaMantenimientoId: inst2._id, proveedorId: prov4._id,
    descripcion: 'Revisión trimestral ascensor — Abril 2025',
    monto: 35000, estado: 'ASIGNADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO', estadoNuevo: 'ASIGNADO', creadoPorId: admin._id, fecha: new Date('2025-04-02') }
    ],
    createdAt: new Date('2025-04-02')
  });

  const plan2 = await PlanMantenimiento.create({
    edificioId: edificio._id,
    tarea: 'Limpieza y desinfección de tanques de agua',
    especialidad: 'plomeria', frecuencia: 'semestral', activo: true
  });

  const inst3 = await InstanciaMantenimiento.create({
    planId: plan2._id, fechaProgramada: new Date('2024-12-01'),
    estado: 'CERRADA', createdAt: new Date('2024-11-15')
  });

  const tPrev2 = await Trabajo.create({
    instanciaMantenimientoId: inst3._id, proveedorId: prov1._id,
    descripcion: 'Vaciado, limpieza, desinfección y llenado de tanques',
    monto: 22000, estado: 'CERRADO', evidencias: [],
    historialEstados: [
      { estadoAnterior: 'CREADO',       estadoNuevo: 'ASIGNADO',     creadoPorId: admin._id,  fecha: new Date('2024-11-20') },
      { estadoAnterior: 'ASIGNADO',     estadoNuevo: 'EN_EJECUCION', creadoPorId: prov1._id,  fecha: new Date('2024-12-01') },
      { estadoAnterior: 'EN_EJECUCION', estadoNuevo: 'FINALIZADO',   creadoPorId: prov1._id,  fecha: new Date('2024-12-01') },
      { estadoAnterior: 'FINALIZADO',   estadoNuevo: 'CERRADO',      creadoPorId: admin._id,  fecha: new Date('2024-12-02') }
    ],
    createdAt: new Date('2024-11-20')
  });

  await Gasto.create({
    edificioId: edificio._id, trabajoId: tPrev2._id, tipo: 'PREVENTIVO',
    monto: 22000, concepto: 'Limpieza de tanques — Diciembre 2024',
    comprobante: null, fecha: new Date('2024-12-02')
  });

  await PlanMantenimiento.create({
    edificioId: edificio._id,
    tarea: 'Revisión general de tableros eléctricos',
    especialidad: 'electricidad', frecuencia: 'anual', activo: false
  });

  await InstanciaMantenimiento.create({
    planId: plan2._id, fechaProgramada: new Date('2025-06-01'),
    estado: 'PROGRAMADA', createdAt: new Date('2025-04-01')
  });

  console.log('3 planes y 4 instancias creadas');

  // ── 6. AVISOS ─────────────────────────────────────────────
  await Aviso.insertMany([
    {
      edificioId: edificio._id, adminId: admin._id,
      titulo: 'Corte de agua — Jueves 8 de mayo',
      cuerpo: 'Se informa a todos los vecinos que el día jueves 8 de mayo de 10:00 a 15:00 hs se realizará un corte de agua en todo el edificio por tareas de mantenimiento en la red principal. Se recomienda tener agua almacenada.',
      fechaPublicacion: new Date('2025-05-05')
    },
    {
      edificioId: edificio._id, adminId: admin._id,
      titulo: 'Recordatorio: reunión de consorcio',
      cuerpo: 'Se convoca a todos los propietarios a la reunión anual de consorcio el día viernes 16 de mayo a las 19:00 hs en el SUM del edificio.',
      fechaPublicacion: new Date('2025-05-01')
    },
    {
      edificioId: edificio._id, adminId: admin._id,
      titulo: 'Nuevo reglamento de uso del SUM',
      cuerpo: 'Se informa que a partir del 1 de mayo rige el nuevo reglamento de uso del Salón de Usos Múltiples.',
      fechaPublicacion: new Date('2025-04-28')
    },
    {
      edificioId: edificio._id, adminId: admin._id,
      titulo: 'Mantenimiento del ascensor — Semana del 14/4',
      cuerpo: 'Durante la semana del 14 al 18 de abril el ascensor estará fuera de servicio por su mantenimiento trimestral.',
      fechaPublicacion: new Date('2025-04-10')
    }
  ]);

  console.log('4 avisos creados');

  // ── 7. DOCUMENTOS ─────────────────────────────────────────
  await Documento.insertMany([
    { edificioId: edificio._id, nombre: 'Reglamento de Copropiedad y Convivencia', url: 'https://res.cloudinary.com/demo/raw/upload/reglamento.pdf', visibilidad: 'todos', categoria: 'reglamento' },
    { edificioId: edificio._id, nombre: 'Acta Asamblea Ordinaria — Abril 2025',     url: 'https://res.cloudinary.com/demo/raw/upload/acta_abril_2025.pdf', visibilidad: 'todos', categoria: 'acta' },
    { edificioId: edificio._id, nombre: 'Acta Asamblea Extraordinaria — Nov 2024',  url: 'https://res.cloudinary.com/demo/raw/upload/acta_nov_2024.pdf', visibilidad: 'todos', categoria: 'acta' },
    { edificioId: edificio._id, nombre: 'Plano del Edificio — Planta Baja',         url: 'https://res.cloudinary.com/demo/raw/upload/plano_pb.pdf', visibilidad: 'solo_admin', categoria: 'plano' },
    { edificioId: edificio._id, nombre: 'Contrato Empresa Limpieza 2025',           url: 'https://res.cloudinary.com/demo/raw/upload/contrato_limpieza.pdf', visibilidad: 'solo_admin', categoria: 'contrato' },
    { edificioId: edificio._id, nombre: 'Informe Técnico Ascensor — Enero 2025',    url: 'https://res.cloudinary.com/demo/raw/upload/informe_ascensor.pdf', visibilidad: 'todos', categoria: 'informe' }
  ]);

  console.log('6 documentos creados');

  // ── Resumen ───────────────────────────────────────────────
  console.log('\nSeed completado exitosamente');
  console.log('─────────────────────────────────────────');
  console.log('admin@consorcio365.com      / Admin123!');
  console.log('juan@mail.com               / Cambiar123!');
  console.log('laura@mail.com              / Cambiar123!');
  console.log('roberto@mail.com            / Cambiar123!');
  console.log('valeria@mail.com            / Cambiar123!');
  console.log('diego@mail.com              / Cambiar123!');
  console.log('sofia@mail.com              / Cambiar123!  (PENDIENTE)');
  console.log('carlos.plomero@mail.com     / Cambiar123!');
  console.log('marcelo.electrico@mail.com  / Cambiar123!');
  console.log('hugo.albanil@mail.com       / Cambiar123!');
  console.log('pablo.ascensores@mail.com   / Cambiar123!');
  console.log('─────────────────────────────────────────');

  mongoose.connection.close();
};

seed().catch(err => {
  console.error('Error en seed:', err);
  mongoose.connection.close();
  process.exit(1);
});