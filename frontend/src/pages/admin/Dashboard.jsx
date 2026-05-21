import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminRecentIncidents from "../../components/admin/AdminRecentIncidents";
import AdminMaintenanceList from "../../components/admin/AdminMaintenanceList";
import AdminLatestExpenses from "../../components/admin/AdminLatestExpenses";

import { useAuth } from "../../hooks/useAuth";
import { adminMenuItems } from "../../data/adminDashboardData";

function DashboardAdmin() {
  const { user } = useAuth();


  const displayUser = user
	? {
    	name: user.name,
    	role: capitalize(user.role), 
  	}
	: null;

  return (
	<DashboardLayout
  	menuItems={adminMenuItems}
  	user={displayUser}
  	title="Panel general"
  	subtitle="Resumen general del sistema"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<AdminStatsGrid />

    	<AdminRecentIncidents />

    	<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      	<AdminMaintenanceList />

      	<AdminLatestExpenses />
    	</div>
  	</section>
	</DashboardLayout>
  );
}

// ✅ Helper para mostrar el rol bonito
function capitalize(role) {
  if (!role) return "";
  switch (role) {
	case "admin":
  	return "Administrador";
	case "ocupante":
  	return "Ocupante";
	case "proveedor":
  	return "Proveedor";
	default:
  	return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

export default DashboardAdmin;

