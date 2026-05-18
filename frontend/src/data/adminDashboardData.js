import {
  LayoutDashboard,
  Users,
  DoorClosed,
  CircleAlert,
  Wrench,
  DollarSign,
  Settings,
  FileText,
  Megaphone,
  TriangleAlert,
  BadgeDollarSign,
} from "lucide-react";

export const adminMenuItems = [
  { label: "Panel general", to: "/admin", icon: LayoutDashboard },
  { label: "Usuarios", to: "/admin/usuarios", icon: Users },
  { label: "Unidades", to: "/admin/unidades", icon: DoorClosed },
  { label: "Incidencias", to: "/admin/incidencias", icon: CircleAlert },
  { label: "Trabajos", to: "/admin/trabajos", icon: Wrench },
  { label: "Gastos", to: "/admin/gastos", icon: DollarSign },
  { label: "Mantenimiento", to: "/admin/mantenimiento", icon: Settings },
  { label: "Documentos", to: "/admin/documentos", icon: FileText },
  { label: "Avisos", to: "/admin/avisos", icon: Megaphone },
];

export const adminUser = {
  name: "Carlos Mendoza",
  role: "Administrador",
};

export const adminStats = [
  {
    id: 1,
    title: "Incidencias Abiertas",
    value: "23",
    trend: "+12% vs mes anterior",
    trendType: "positive",
    icon: TriangleAlert,
  },
  {
    id: 2,
    title: "Trabajos en Progreso",
    value: "8",
    trend: "-5% vs mes anterior",
    trendType: "negative",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Gastos del Mes",
    value: "$45.2K",
    trend: "+8% vs mes anterior",
    trendType: "positive",
    icon: BadgeDollarSign,
  },
];

export const adminIncidentRows = [
  {
    id: 1,
    title: "Pérdida de agua en baño",
    building: "Torre Norte",
    unit: "5B",
    status: "ABIERTA",
    date: "15/01/2024",
  },
  {
    id: 2,
    title: "Ascensor fuera de servicio",
    building: "Torre Norte",
    unit: "Común",
    status: "EN TRABAJO",
    date: "14/01/2024",
  },
  {
    id: 3,
    title: "Ruidos molestos en unidad",
    building: "Torre Norte",
    unit: "8A",
    status: "RESUELTA",
    date: "12/01/2024",
  },
];

export const adminMaintenanceItems = [
  {
    id: 1,
    title: "Mantenimiento de Ascensores",
    subtitle: "Torre Norte • 20/01/2024",
    description: "Proveedor: Ascensores Rápidos SA",
    icon: Settings,
  },
  {
    id: 2,
    title: "Inspección Eléctrica",
    subtitle: "Torre Norte • 22/01/2024",
    description: "Proveedor: ElectroServicios",
    icon: Wrench,
  },
];

export const adminExpenseRows = [
  {
    id: 1,
    description: "Reparación bomba agua",
    amount: "$8,500",
    origin: "Trabajo",
    date: "14/01/24",
  },
  {
    id: 2,
    description: "Mant. mensual ascensores",
    amount: "$12,000",
    origin: "Mantenimiento",
    date: "10/01/24",
  },
  {
    id: 3,
    description: "Cambio luminarias LED",
    amount: "$4,200",
    origin: "Trabajo",
    date: "08/01/24",
  },
];