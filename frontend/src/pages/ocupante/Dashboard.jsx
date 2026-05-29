import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MiUnidadCard from "../../components/ocupante/MiUnidadCard";
import OcupanteReclamosList from "../../components/ocupante/OcupanteReclamosList";
import OcupanteAvisosList from "../../components/ocupante/OcupanteAvisosList";

import { useAuth } from "../../hooks/useAuth";
import { ocupanteMenuItems } from "../../data/ocupanteDashboardData";

function DashboardOcupante() {
  const { user } = useAuth();

  const displayUser = user
	? { name: user.name, role: capitalize(user.role) }
	: { name: "María Lozana", role: "Ocupante" }; // fallback p/ prototipo

  return (
	<DashboardLayout
  	menuItems={ocupanteMenuItems}
  	user={displayUser}
  	title="Panel general"
  	subtitle="Bienvenido a su panel general de Consorcio365"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<MiUnidadCard />

    	<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      	<OcupanteReclamosList />
      	<OcupanteAvisosList />
    	</div>
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

export default DashboardOcupante;

