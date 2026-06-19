import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  obtenerConfiguracionPanelPorRol,
  obtenerEtiquetaRol,
} from "../../configuracion/configuracionPanelPorRol";

function ContenedorPanelPorRol({
  children,
  titulo,
  subtitulo,
  showSettingsButton = true,
}) {
  
  const { user } = useAuth();
  const navegar = useNavigate();

  const configuracion = obtenerConfiguracionPanelPorRol(user?.role);

  const usuarioMostrado = user
    ? {
        name: user.name || user.nombre,
        role: obtenerEtiquetaRol(user.role),
        avatarUrl: user.avatarUrl || user.avatar || "",
      }
    : null;

  
  const handleIrAPerfil = () => {
    const rol = String(user?.role || "").toLowerCase();

    if (rol === "admin" || rol === "administrador") {
      navegar("/admin/perfil");
      return;
    }

    if (rol === "ocupante") {
      navegar("/ocupante/perfil");
      return;
    }

    if (rol === "proveedor") {
      navegar("/proveedor/perfil");
      return;
    }
  };

  return (
    <DashboardLayout
      menuItems={configuracion?.menuItems ?? []}
      user={usuarioMostrado}
      title={titulo ?? configuracion?.tituloPorDefecto ?? "Panel general"}
      subtitle={subtitulo ?? configuracion?.subtituloPorDefecto ?? ""}
      onSettingsClick={handleIrAPerfil}
      showSettingsButton={showSettingsButton}

    >
      {children}
    </DashboardLayout>
  );
}

export default ContenedorPanelPorRol;