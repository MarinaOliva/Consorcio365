// src/components/admin/PanelGeneralAdmin.jsx

import AdminStatsGrid from "./AdminStatsGrid";
import AdminRecentIncidents from "./AdminRecentIncidents";
import AdminMaintenanceList from "./AdminMaintenanceList";
import AdminLatestExpenses from "./AdminLatestExpenses";

function PanelGeneralAdmin() {
  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <AdminStatsGrid />

      <AdminRecentIncidents />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminMaintenanceList />
        <AdminLatestExpenses />
      </div>
    </section>
  );
}

export default PanelGeneralAdmin;