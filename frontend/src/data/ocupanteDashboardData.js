// src/data/ocupanteDashboardData.js

export const ocupanteMenuItems = [
  { label: "Panel general", path: "/ocupante/panel" },
  { label: "Mis reclamos", path: "/ocupante/reclamos" },
  { label: "Libro de Gastos", path: "/ocupante/gastos" },
  { label: "Documentos", path: "/ocupante/documentos" },
  { label: "Avisos", path: "/ocupante/avisos" },
];

export const ocupanteUsuario = {
  nombre: "María Lozana",
  rol: "Ocupante",
};

export const unidadActual = {
  codigo: "5B",
  piso: "Piso 5",
  torre: "Torre Norte",
  relacion: "PROPIETARIO", // badge
};

export const reclamosRecientes = [
  { titulo: "Pérdida de agua en baño", fecha: "15/01/2024", estado: "ABIERTA" },
  { titulo: "Problema con calefacción", fecha: "08/01/2024", estado: "EN TRABAJO" },
  { titulo: "Luz de pasillo sin funcionar", fecha: "20/12/2023", estado: "RESUELTA" },
];

export const avisosEdificio = [
  {
    titulo: "Corte de agua programado",
    descripcion:
      "Se realizará mantenimiento del tanque de agua el día sábado 20/01 de 8:00 a 14:00 hs.",
    publicado: "15/01/2024",
    color: "rojo",
  },
  {
    titulo: "Reunión de consorcio",
    descripcion:
      "Se convoca a asamblea ordinaria el día 25/01 a las 19:00 hs en el SUM del edificio.",
    publicado: "12/01/2024",
    color: "azul",
  },
  {
    titulo: "Nuevas normas de convivencia",
    descripcion:
      "Se actualizó el reglamento interno. Disponible en la sección Documentos.",
    publicado: "05/01/2024",
    color: "azul",
  },
];
