// src/pages/admin/Dashboard.jsx

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import PanelGeneralAdmin from "../../components/admin/PanelGeneralAdmin";

function DashboardAdmin() {
  return (
    <ContenedorPanelPorRol
      titulo="Panel general"
      subtitulo="Resumen general del sistema"
    >
      <PanelGeneralAdmin />
    </ContenedorPanelPorRol>
  );
}

export default DashboardAdmin;