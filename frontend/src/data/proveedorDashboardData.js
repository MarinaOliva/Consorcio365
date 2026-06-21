import { LayoutGrid, Briefcase } from "lucide-react";

export const proveedorMenuItems = [
  { label: "Panel general", icon: LayoutGrid, to: "/proveedor", end: true },
  { label: "Historial de trabajos", icon: Briefcase, to: "/proveedor/trabajos" },
];

export const especialidadMock = "Plomería e Instalaciones Sanitarias";

export const proveedorStatsMock = {
  pendientes: 3,
  enCurso: 2,
  finalizados: 12,
};

export const trabajosActivosMock = [
  {
    id: 1,
    titulo: "Reparación de filtración en baño",
    ubicacion: "Torre Norte",
    fechaAsignacion: "15/01/2024",
    monto: 32500,
    estado: "Asignado",
  },
  {
    id: 2,
    titulo: "Instalación de nuevos grifos en cocina",
    ubicacion: "Torre Norte",
    fechaAsignacion: "12/01/2024",
    monto: 18900,
    estado: "En progreso",
  },
  {
    id: 3,
    titulo: "Reparación bomba de agua",
    ubicacion: "Torre Norte",
    fechaAsignacion: "08/01/2024",
    monto: 45000,
    estado: "En progreso",
  },
  {
    id: 4,
    titulo: "Mantenimiento preventivo cañerías",
    ubicacion: "Torre Norte",
    fechaAsignacion: "18/01/2024",
    monto: 28000,
    estado: "Asignado",
  },
  {
    id: 5,
    titulo: "Cambio de válvulas tanque de agua",
    ubicacion: "Torre Norte",
    fechaAsignacion: "17/01/2024",
    monto: 22400,
    estado: "Asignado",
  },
];

export const historialTrabajosProveedorMock = [
  {
    id: 842,
    titulo: "Reparación de bomba de agua",
    ubicacion: "Torre Norte",
    edificio: "Torre Norte",
    unidad: "5B",
    monto: 8500,
    estado: "Finalizado",
    fechaAsignacion: "15/01/2026",
    fechaFinalizacion: "16/01/2026",
    duracion: "2 días",
    descripcion:
      "Reparación completa de la bomba de agua del tanque principal. Incluye cambio de sello mecánico, rodamientos y verificación del sistema eléctrico. Se detectó desgaste en componentes internos que requerirán reemplazo inmediato.",
    evidencias: [
      { id: 1, name: "evidencia_1.jpg" },
      { id: 2, name: "evidencia_2.jpg" },
      { id: 3, name: "evidencia_3.jpg" },
      { id: 4, name: "Informe_Tecnico.pdf" },
    ],
    proveedor: "José Aguirre",
  },
  {
    id: 843,
    titulo: "Mantenimiento de canillas.",
    ubicacion: "Torre Norte",
    edificio: "Torre Norte",
    unidad: "PB",
    monto: 15320,
    estado: "Finalizado",
    fechaAsignacion: "10/03/2026",
    fechaFinalizacion: "11/03/2026",
    duracion: "2 días",
    descripcion:
      "Mantenimiento correctivo y preventivo de canillas del sector común.",
    evidencias: [{ id: 1, name: "tablero_final.jpg" }],
    proveedor: "José Aguirre",
  },
  {
    id: 844,
    titulo: "Revisión griferías",
    ubicacion: "Torre Norte",
    edificio: "Torre Norte",
    unidad: "5B",
    monto: 15320,
    estado: "Cerrado",
    fechaAsignacion: "20/02/2026",
    fechaFinalizacion: "21/02/2026",
    duracion: "1 día",
    descripcion:
      "Trabajo revisado y cerrado por administración luego de validar las evidencias.",
    evidencias: [{ id: 1, name: "revision_sistema.pdf" }],
    proveedor: "José Aguirre",
  },
  {
    id: 845,
    titulo: "Limpieza de tanques de agua",
    ubicacion: "Torre Norte",
    edificio: "Torre Norte",
    unidad: "Azotea",
    monto: 15320,
    estado: "Cerrado",
    fechaAsignacion: "12/02/2026",
    fechaFinalizacion: "13/02/2026",
    duracion: "1 día",
    descripcion:
      "Limpieza completa de tanque con cierre administrativo posterior.",
    evidencias: [],
    proveedor: "José Aguirre",
  },
];