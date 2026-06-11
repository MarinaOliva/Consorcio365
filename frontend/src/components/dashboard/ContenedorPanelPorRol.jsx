// src/components/dashboard/ContenedorPanelPorRol.jsx

import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  obtenerConfiguracionPanelPorRol,
  obtenerEtiquetaRol,
} from "../../configuracion/configuracionPanelPorRol";

function ContenedorPanelPorRol({
  children,
  titulo,
  subtitulo,
}) {
  const { user } = useAuth();

  const configuracion = obtenerConfiguracionPanelPorRol(user?.role);

  const usuarioMostrado = user
    ? {
        name: user.name,
        role: obtenerEtiquetaRol(user.role),
      }
    : null;

  return (
    <DashboardLayout
      menuItems={configuracion?.menuItems ?? []}
      user={usuarioMostrado}
      title={titulo ?? configuracion?.tituloPorDefecto ?? "Panel general"}
      subtitle={subtitulo ?? configuracion?.subtituloPorDefecto ?? ""}
    >
      {children}
    </DashboardLayout>
  );
}

export default ContenedorPanelPorRol;