// src/pages/proveedor/Dashboard.jsx

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import PanelGeneralProveedor from "../../components/proveedor/PanelGeneralProveedor";

function DashboardProveedor() {
  return (
    <ContenedorPanelPorRol
      titulo="Panel general"
      subtitulo="Bienvenido a su panel general de Consorcio365"
    >
      <PanelGeneralProveedor />
    </ContenedorPanelPorRol>
  );
}
export default DashboardProveedor;