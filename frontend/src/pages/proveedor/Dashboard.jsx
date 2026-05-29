import DashboardLayout from "../../components/dashboard/DashboardLayout";
import EspecialidadBanner from "../../components/proveedor/EspecialidadBanner";
import ProveedorStatsGrid from "../../components/proveedor/ProveedorStatsGrid";
import TrabajosActivosList from "../../components/proveedor/TrabajosActivosList";

import { useAuth } from "../../hooks/useAuth";
import {
  proveedorMenuItems,
  especialidadMock,
  proveedorStatsMock,
  trabajosActivosMock,
} from "../../data/proveedorDashboardData";

function DashboardProveedor() {
  const { user } = useAuth();

  const displayUser = user
	? { name: user.name, role: capitalize(user.role) }
	: { name: "José Aguirre", role: "Proveedor" }; // fallback p/ prototipo

  return (
	<DashboardLayout
  	menuItems={proveedorMenuItems}
  	user={displayUser}
  	title="Panel general"
  	subtitle="Bienvenido a su panel general de Consorcio 365"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<EspecialidadBanner especialidad={especialidadMock} />

    	<ProveedorStatsGrid stats={proveedorStatsMock} />

    	<TrabajosActivosList trabajos={trabajosActivosMock} />
  	</section>
	</DashboardLayout>
  );
}

function capitalize(role) {
  if (!role) return "";
  switch (role) {
	case "admin": 	return "Administrador";
	case "ocupante":  return "Ocupante";
	case "proveedor": return "Proveedor";
	default:      	return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

export default DashboardProveedor;

