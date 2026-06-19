import { convertirFechaArgentinaADate } from "./fechas";

export const TRABAJO_DRAFT_INICIAL = {
  numeroIncidencia: "",
  origen: "Manual",
  estado: "Asignado",
  categoria: "",
  unidad: "",
  piso: "",
  edificio: "",

  titulo: "",
  descripcion: "",
  responsable: "",
  fechaInicioEstimada: "",
  costoEstimado: "",
  prioridad: "",
  aCargoDe: "",
};

export function clonarObjeto(objeto) {
  return typeof structuredClone === "function"
    ? structuredClone(objeto)
    : JSON.parse(JSON.stringify(objeto));
}

export function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatearFechaInput(fechaISO) {
  if (!fechaISO) return "";

  const [anio, mes, dia] = fechaISO.split("-");

  if (!anio || !mes || !dia) return fechaISO;

  return `${dia}/${mes}/${anio}`;
}

export function convertirMontoANumero(valor) {
  const limpio = String(valor ?? "")
    .replaceAll(".", "")
    .replaceAll(",", ".")
    .replace(/[^\d.]/g, "");

  const numero = Number(limpio);

  return Number.isNaN(numero) ? 0 : numero;
}

export function obtenerCodigoTrabajo(trabajo) {
  const base =
    trabajo?.codigoTrabajo || trabajo?.id || trabajo?.numeroIncidencia || 0;

  return `TRB-${String(base).padStart(4, "0")}`;
}

export function sumarDiasAFechaArgentina(fecha, dias) {
  const fechaBase = convertirFechaArgentinaADate(fecha);

  if (!fechaBase) return fecha;

  const nuevaFecha = new Date(fechaBase);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);

  return nuevaFecha.toLocaleDateString("es-AR");
}

export function obtenerDetalleTrabajo(trabajo) {
  const codigoTrabajo = obtenerCodigoTrabajo(trabajo);
  const fechaInicio = trabajo.fecha;
  const fechaFinalizacion =
    trabajo.fechaFinalizacion || sumarDiasAFechaArgentina(fechaInicio, 1);

  return {
    ...trabajo,
    codigoTrabajo,
    titulo: trabajo.incidencia || "Trabajo sin título",
    descripcion:
      trabajo.descripcion ||
      "Reparación completa del trabajo solicitado. Incluye diagnóstico, revisión de componentes afectados, ejecución de la tarea y verificación final del servicio.",
    edificio: trabajo.edificio || "Torre Norte",
    unidad: trabajo.unidad || "5B",
    presupuesto: formatearMonto(trabajo.presupuesto || 0),
    fechaInicio,
    fechaFinalizacion,
    duracion: trabajo.duracion || "2 días",
    estado: trabajo.estado,
    proveedor: trabajo.proveedor || "Sin proveedor asignado",
    incidenciaOrigen: {
      numero: trabajo.numeroIncidencia || "1238",
      titulo:
        trabajo.origen === "Mantenimiento"
          ? "Mantenimiento programado"
          : "Falta de presión de agua en edificio",
      fecha: trabajo.fecha,
    },
    historial: [
      {
        id: 1,
        tipo: "creado",
        titulo: "Trabajo creado",
        fecha: trabajo.fecha,
        hora: "10:30 hs",
        usuario: "Carlos Mendoza (Admin)",
        descripcion: `Trabajo creado desde la ${
          trabajo.origen?.toLowerCase() || "incidencia"
        } #${trabajo.numeroIncidencia || "-"}.`,
      },
      {
        id: 2,
        tipo: "asignado",
        titulo: "Proveedor asignado",
        fecha: trabajo.fecha,
        hora: "14:15 hs",
        usuario: "Carlos Mendoza (Admin)",
        descripcion: `Se asignó el trabajo a ${
          trabajo.proveedor || "un proveedor"
        } con presupuesto aprobado.`,
      },
      {
        id: 3,
        tipo: "iniciado",
        titulo: "Trabajo iniciado",
        fecha: fechaInicio,
        hora: "17:00 hs",
        usuario: trabajo.proveedor || "Proveedor",
        descripcion:
          "El proveedor confirmó el inicio de los trabajos en el sitio.",
      },
      {
        id: 4,
        tipo: "finalizado",
        titulo: "Trabajo finalizado",
        fecha: fechaFinalizacion,
        hora: "13:45 hs",
        usuario: trabajo.proveedor || "Proveedor",
        descripcion:
          "El proveedor marcó el trabajo como finalizado y subió las evidencias correspondientes.",
      },
    ],
    evidencias: [
      {
        id: 1,
        tipo: "imagen",
        titulo: "Evidencia 1",
        className: "from-cyan-900 via-slate-700 to-emerald-400",
      },
      {
        id: 2,
        tipo: "imagen",
        titulo: "Evidencia 2",
        className: "from-slate-900 via-cyan-700 to-blue-300",
      },
      {
        id: 3,
        tipo: "imagen",
        titulo: "Evidencia 3",
        className: "from-yellow-300 via-slate-500 to-stone-700",
      },
      {
        id: 4,
        tipo: "pdf",
        titulo: "Informe_Tecnico.pdf",
      },
    ],
  };
}

export function obtenerColorHistorialTrabajo(tipo) {
  const colores = {
    creado: "bg-red-500",
    asignado: "bg-yellow-500",
    iniciado: "bg-blue-500",
    finalizado: "bg-emerald-500",
  };

  return colores[tipo] || "bg-slate-400";
}