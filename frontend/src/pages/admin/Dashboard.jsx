import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminRecentIncidents from "../../components/admin/AdminRecentIncidents";
import AdminMaintenanceList from "../../components/admin/AdminMaintenanceList";
import AdminLatestExpenses from "../../components/admin/AdminLatestExpenses";

import {
  adminMenuItems,
  adminUser,
} from "../../data/adminDashboardData";

function DashboardAdmin() {
  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      user={adminUser}
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

export default DashboardAdmin;
