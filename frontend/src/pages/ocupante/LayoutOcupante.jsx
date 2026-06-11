import { Outlet } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ocupanteMenuItems, ocupanteUsuario } from "../../data/ocupanteDashboardData";

function LayoutOcupante() {
  return (
    <DashboardLayout
      menuItems={ocupanteMenuItems}
      user={ocupanteUsuario}
      title="Panel general"
      subtitle="Bienvenido a su panel general de Consorcio365"
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default LayoutOcupante;