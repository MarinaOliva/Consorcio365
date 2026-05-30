// src/data/ocupanteDashboardData.js

import {
  LayoutGrid,
  AlertCircle,
  DollarSign,
  FileText,
  Megaphone,
} from "lucide-react";

export const ocupanteMenuItems = [
  { label: "Panel general", icon: LayoutGrid, to: "/ocupante", end: true },
  { label: "Mis reclamos", icon: AlertCircle, to: "/ocupante/reclamos" },
  { label: "Libro de Gastos", icon: DollarSign, to: "/ocupante/gastos" },
  { label: "Documentos", icon: FileText, to: "/ocupante/documentos" },
  { label: "Avisos", icon: Megaphone, to: "/ocupante/avisos" },
];

export const miUnidadMock = {
  numero: "5B",
  piso: "Piso 5",
  torre: "Torre Norte",
  relacion: "Propietario",
};

export const reclamosMock = [
  { id: 1, titulo: "Pérdida de agua en baño", fecha: "15/01/2024", estado: "Abierta" },
  { id: 2, titulo: "Problema con calefacción", fecha: "08/01/2024", estado: "En trabajo" },
  { id: 3, titulo: "Luz de pasillo sin funcionar", fecha: "20/12/2023", estado: "Resuelta" },
];

export const avisosMock = [
  {
    id: 1,
    titulo: "Corte de agua programado",
    descripcion:
      "Se realizará mantenimiento del tanque de agua el día sábado 20/01 de 8:00 a 14:00 hs.",
    fecha: "15/01/2024",
    prioridad: "alta",
  },
  {
    id: 2,
    titulo: "Reunión de consorcio",
    descripcion:
      "Se convoca a asamblea ordinaria el día 25/01 a las 19:00 hs en el SUM del edificio.",
    fecha: "12/01/2024",
    prioridad: "media",
  },
  {
    id: 3,
    titulo: "Nuevas normas de convivencia",
    descripcion:
      "Se actualizó el reglamento interno. Disponible en la sección Documentos.",
    fecha: "05/01/2024",
    prioridad: "baja",
  },
];