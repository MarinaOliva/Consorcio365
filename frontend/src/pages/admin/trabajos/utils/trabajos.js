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

  const historialReal = trabajo.historialEstados || [];

  // Fecha de inicio = cuando pasó a EN_EJECUCION
  const itemEnEjecucion = historialReal.find(
    (h) => h.estadoNuevo === "EN_EJECUCION"
  );
  const fechaInicio = itemEnEjecucion
    ? new Date(itemEnEjecucion.fecha).toLocaleDateString("es-AR")
    : "—";

  // Fecha de finalización
  const itemFinalizado = historialReal.find(
    (h) => h.estadoNuevo === "FINALIZADO"
  );
  const fechaFinalizacion = itemFinalizado
    ? new Date(itemFinalizado.fecha).toLocaleDateString("es-AR")
    : "—";

  // Duración
  const duracion = (() => {
    if (!itemEnEjecucion || !itemFinalizado) return "—";
    const inicio = new Date(itemEnEjecucion.fecha);
    const fin = new Date(itemFinalizado.fecha);
    const dias = Math.max(1, Math.round((fin - inicio) / (1000 * 60 * 60 * 24)));
    return dias === 1 ? "1 día" : `${dias} días`;
  })();

  // Fecha de creación
  const fechaCreado = trabajo.fechaISO
    ? new Date(trabajo.fechaISO).toLocaleDateString("es-AR")
    : "";

  const origenIncidencia = trabajo.incidenciaId
	? {
    	numero: trabajo._raw?.incidenciaId?._id?.slice(-4) || "----",
    	titulo: trabajo._raw?.incidenciaId?.titulo || "Sin título",
    	fecha: fechaCreado,
  	}
	: {
    	numero: trabajo._raw?.instanciaMantenimientoId?._id?.slice(-4) || "----",
    	titulo: "Instancia de mantenimiento",
    	fecha: fechaCreado,
  	};

  const evidenciasReales = (trabajo.evidencias || []).map((url, index) => {
	const esPdf = /\.pdf(\?|$)/i.test(url);
	return {
  	id: index + 1,
  	tipo: esPdf ? "pdf" : "imagen",
  	titulo: esPdf ? `Comprobante ${index + 1}.pdf` : `Evidencia ${index + 1}`,
  	url,
	};
  });

  const historialAdaptado = historialReal.map((h, index) => ({
	id: h._id || index,
	tipo: mapearEstadoATipoHistorial(h.estadoNuevo),
	titulo: mapearEstadoATituloHistorial(h.estadoNuevo, h.estadoAnterior),
	fecha: h.fecha ? new Date(h.fecha).toLocaleDateString("es-AR") : "",
	hora: h.fecha
  	? new Date(h.fecha).toLocaleTimeString("es-AR", {
      	hour: "2-digit",
      	minute: "2-digit",
    	}) + " hs"
  	: "",
	usuario: h.creadoPorId?.nombre
  	? `${h.creadoPorId.nombre} ${h.creadoPorId.apellido || ""}`.trim()
  	: "Sistema",
	descripcion: h.observacion || "",
  }));

  return {
	...trabajo,
	codigoTrabajo,
	titulo: trabajo.incidencia || trabajo.descripcion || "Trabajo",
	descripcion: trabajo.descripcion || "Sin descripción",
	edificio: trabajo.edificio || "—",
	unidad: trabajo.unidad || "—",
	presupuesto: formatearMonto(trabajo.presupuesto || 0),
	fechaInicio,
	fechaFinalizacion,
	duracion,
	estado: trabajo.estado,
	proveedor: trabajo.proveedor || "Sin proveedor asignado",
	incidenciaOrigen: origenIncidencia,
	historial: historialAdaptado,
	evidencias: evidenciasReales,
  };
}


// Helpers para el historial
function mapearEstadoATipoHistorial(estadoNuevo) {
  const mapa = {
	CREADO: "creado",
	ASIGNADO: "asignado",
	EN_EJECUCION: "iniciado",
	FINALIZADO: "finalizado",
	CERRADO: "finalizado",
	CANCELADO: "finalizado",
  };
  return mapa[estadoNuevo] || "creado";
}

function mapearEstadoATituloHistorial(estadoNuevo, estadoAnterior) {
  if (estadoAnterior === estadoNuevo) return "Trabajo actualizado";

  const mapa = {
	CREADO: "Trabajo creado",
	ASIGNADO: "Proveedor asignado",
	EN_EJECUCION: "Trabajo iniciado",
	FINALIZADO: "Trabajo finalizado",
	CERRADO: "Trabajo cerrado",
	CANCELADO: "Trabajo cancelado",
  };
  return mapa[estadoNuevo] || estadoNuevo;
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