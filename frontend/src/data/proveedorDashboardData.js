// src/data/proveedorDashboardData.js

import { LayoutGrid, Briefcase } from "lucide-react";

export const proveedorMenuItems = [
  { label: "Panel general", icon: LayoutGrid, to: "/proveedor", end: true },
  { label: "Mis Trabajos", icon: Briefcase, to: "/proveedor/trabajos" },
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