import AdminStatsGrid from "./AdminStatsGrid";
import AdminRecentIncidents from "./AdminRecentIncidents";
import AdminMaintenanceList from "./AdminMaintenanceList";
import AdminLatestExpenses from "./AdminLatestExpenses";

import { usePanelAdmin } from "../../hooks/usePanelAdmin";

function PanelGeneralAdmin() {
  const {
	loading,
	error,
	stats,
	incidenciasRecientes,
	proximosMantenimientos,
	ultimosGastos,
  } = usePanelAdmin();

  if (loading) {
	return (
  	<section className="mx-auto max-w-[1120px]">
    	<p className="py-6 text-sm text-textMuted">Cargando panel...</p>
  	</section>
	);
  }

  if (error) {
	return (
  	<section className="mx-auto max-w-[1120px]">
    	<div className="rounded-md border border-red-200 bg-red-50 p-4">
      	<p className="text-sm font-semibold text-red-600">{error}</p>
    	</div>
  	</section>
	);
  }

  return (
	<section className="mx-auto max-w-[1120px] space-y-5">
  	<AdminStatsGrid stats={stats} />

  	<AdminRecentIncidents incidencias={incidenciasRecientes} />

  	<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
    	<AdminMaintenanceList mantenimientos={proximosMantenimientos} />
    	<AdminLatestExpenses gastos={ultimosGastos} />
  	</div>
	</section>
  );
}

export default PanelGeneralAdmin;