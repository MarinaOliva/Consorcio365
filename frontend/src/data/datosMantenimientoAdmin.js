import {
  CalendarCheck2,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export const ESTADISTICAS_MANTENIMIENTO = [
  {
    id: 1,
    titulo: "Planes activos",
    valor: "12",
    icono: CalendarCheck2,
  },
  {
    id: 2,
    titulo: "Instancias próximas este mes",
    valor: "5",
    icono: Clock3,
  },
  {
    id: 3,
    titulo: "Instancias completadas este año",
    valor: "28",
    icono: CheckCircle2,
  },
];

export const PLANES_MANTENIMIENTO_MOCK = [
  {
    id: 1,
    tarea: "Mantenimiento de jardín",
    especialidad: "Jardinería",
    frecuencia: "Mensual",
    estadoPlan: "Inactivo",
    instanciaProgramada: "---",
    estadoInstancia: "---",
  },
  {
    id: 2,
    tarea: "Mantenimiento de ascensores",
    especialidad: "Electromecánica",
    frecuencia: "Mensual",
    estadoPlan: "Activo",
    instanciaProgramada: "25/06/2026",
    estadoInstancia: "En curso",
  },
  {
    id: 3,
    tarea: "Limpieza de tanques",
    especialidad: "Limpieza",
    frecuencia: "Mensual",
    estadoPlan: "Activo",
    instanciaProgramada: "A programar",
    estadoInstancia: "---",
  },
  {
    id: 4,
    tarea: "Mantenimiento de bombas",
    especialidad: "Mecánica",
    frecuencia: "Mensual",
    estadoPlan: "Activo",
    instanciaProgramada: "25/06/2026",
    estadoInstancia: "Programado",
  },
  {
    id: 5,
    tarea: "Mantenimiento de tablero eléctrico general",
    especialidad: "Eléctrico",
    frecuencia: "Mensual",
    estadoPlan: "Activo",
    instanciaProgramada: "25/06/2026",
    estadoInstancia: "Programado",
  },
];