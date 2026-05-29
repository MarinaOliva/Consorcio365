import { Clock, Wrench, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";

function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
	<Card className="border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
  	<div className="flex items-center gap-3">
    	<div
      	className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
    	>
      	<Icon size={20} className={iconColor} />
    	</div>

    	<div>
      	<p className="text-xs font-medium text-textMuted">{label}</p>
      	<p className="text-2xl font-bold text-primary leading-tight">
        	{value}
      	</p>
    	</div>
  	</div>
	</Card>
  );
}

function ProveedorStatsGrid({ stats }) {
  return (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  	<StatCard
    	icon={Clock}
    	iconBg="bg-orange-50"
    	iconColor="text-orange-500"
    	label="Trabajos Pendientes"
    	value={stats.pendientes}
  	/>
  	<StatCard
    	icon={Wrench}
    	iconBg="bg-blue-50"
    	iconColor="text-blue-500"
    	label="En Curso"
    	value={stats.enCurso}
  	/>
  	<StatCard
    	icon={CheckCircle2}
    	iconBg="bg-emerald-50"
    	iconColor="text-emerald-500"
    	label="Finalizados"
    	value={stats.finalizados}
  	/>
	</div>
  );
}

export default ProveedorStatsGrid;

