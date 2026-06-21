import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import PanelGeneralOcupante from "../../components/ocupante/PanelGeneralOcupante";

function DashboardOcupante() {
  return (
    <ContenedorPanelPorRol
      titulo="Panel general"
      subtitulo="Bienvenido a su panel general de Consorcio365"
    >
      <PanelGeneralOcupante />
    </ContenedorPanelPorRol>
  );
}

export default DashboardOcupante;