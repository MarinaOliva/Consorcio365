export function clonarObjeto(objeto) {
  return typeof structuredClone === "function"
    ? structuredClone(objeto)
    : JSON.parse(JSON.stringify(objeto));
}

export function obtenerDetalleIncidencia(incidencia) {
  return {
    ...incidencia,
    fechaCreacionCompleta:
      incidencia.fechaCreacionCompleta || `${incidencia.fechaCreacion} 10:30`,
    prioridad: incidencia.prioridad || "Alta",
    descripcion:
      incidencia.descripcion ||
      "Se detectó una pérdida de agua constante en el baño principal. El agua gotea de forma continua y la situación genera desperdicio de agua y molestias durante la noche.",
    trabajosAsociados:
      incidencia.trabajosAsociados || [
        {
          id: 1,
          titulo: "Reparación de canilla - Baño principal",
          proveedor: "Plomería Rápida SRL",
          fechaProgramada: "18/01/2024",
          estado: "Asignado",
        },
      ],
    evidencias:
      incidencia.evidencias || [
        "Baño principal",
        "Grifería",
        "Mueble bajo mesada",
      ],
    historial:
      incidencia.historial || [
        {
          id: 1,
          tipo: "creada",
          titulo: "Incidencia creada",
          fecha: incidencia.fechaCreacion,
          hora: "10:30 hs",
          usuario: incidencia.creadoPor,
          descripcion:
            "Se reportó la incidencia desde la unidad indicada.",
        },
        {
          id: 2,
          tipo: "estado",
          titulo: "Estado actualizado",
          fecha: "15/01/2026",
          hora: "14:15 hs",
          usuario: "Administrador",
          descripcion:
            "La incidencia pasó al estado Asignado. Se asignó el proveedor Plomería Rápida SRL para su resolución.",
        },
        {
          id: 3,
          tipo: "trabajo",
          titulo: "Trabajo asociado",
          fecha: "16/01/2026",
          hora: "09:00 hs",
          usuario: "Plomería Rápida SRL",
          descripcion:
            "Se programó una visita para revisar y resolver la incidencia.",
        },
        {
          id: 4,
          tipo: "comentario",
          titulo: "Comentario agregado",
          fecha: "16/01/2026",
          hora: "16:45 hs",
          usuario: incidencia.creadoPor,
          descripcion:
            "La situación continúa, la pérdida empeoró durante la noche. Se solicita resolver con prioridad.",
        },
      ],
  };
}

export function obtenerColorHistorial(tipo) {
  const colores = {
    creada: "bg-red-500",
    estado: "bg-blue-500",
    trabajo: "bg-blue-500",
    comentario: "bg-red-500",
  };

  return colores[tipo] || "bg-slate-400";
}