import { adminMenuItems } from "../data/adminDashboardData";
import { ocupanteMenuItems } from "../data/ocupanteDashboardData";
import { proveedorMenuItems } from "../data/proveedorDashboardData";

export const configuracionPanelPorRol = {
  admin: {
    etiquetaRol: "Administrador",
    rutaBase: "/admin",
    tituloPorDefecto: "Panel general",
    subtituloPorDefecto: "Resumen general del sistema",
    menuItems: adminMenuItems,
  },
  ocupante: {
    etiquetaRol: "Ocupante",
    rutaBase: "/ocupante",
    tituloPorDefecto: "Panel general",
    subtituloPorDefecto: "Bienvenido a su panel general de Consorcio365",
    menuItems: ocupanteMenuItems,
  },
  proveedor: {
    etiquetaRol: "Proveedor",
    rutaBase: "/proveedor",
    tituloPorDefecto: "Panel general",
    subtituloPorDefecto: "Bienvenido a su panel general de Consorcio365",
    menuItems: proveedorMenuItems,
  },
};

export function obtenerConfiguracionPanelPorRol(rol) {
  return configuracionPanelPorRol[rol] ?? null;
}

export function obtenerEtiquetaRol(rol) {
  const configuracion = obtenerConfiguracionPanelPorRol(rol);
  return configuracion?.etiquetaRol ?? rol ?? "";
}