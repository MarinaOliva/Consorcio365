// src/components/proveedor/PanelGeneralProveedor.jsx

import EspecialidadBanner from "./EspecialidadBanner";
import ProveedorStatsGrid from "./ProveedorStatsGrid";
import TrabajosActivosList from "./TrabajosActivosList";
import {
  especialidadMock,
  proveedorStatsMock,
  trabajosActivosMock,
} from "../../data/proveedorDashboardData";

function PanelGeneralProveedor() {
  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <EspecialidadBanner especialidad={especialidadMock} />
      <ProveedorStatsGrid stats={proveedorStatsMock} />
      <TrabajosActivosList trabajos={trabajosActivosMock} />
    </section>
  );
}

export default PanelGeneralProveedor;