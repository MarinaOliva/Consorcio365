import { Calendar, Plus } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import StatusBadge from "../dashboard/StatusBadge";

function OcupanteReclamosList({
  reclamos = [],
  onNuevo = () => {},
  onVerTodas = () => {},
}) {
  return (
	<Card className="flex flex-col border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
  	{/* Header */}
  	<div className="mb-3 flex items-center justify-between gap-4">
    	<h2 className="text-base font-bold text-primary">Mis Reclamos</h2>
    	<button
      	onClick={onVerTodas}
      	className="text-xs font-semibold text-primary hover:underline"
    	>
      	Ver todas
    	</button>
  	</div>

  	{/* Lista */}
  	<div className="flex-1 space-y-3">
    	{reclamos.map((r) => (
      	<div
        	key={r.id}
        	className="rounded-lg border border-border/70 bg-surfaceSoft/40 p-3"
      	>
        	<div className="flex items-start justify-between gap-3">
          	<p className="text-sm font-semibold text-textMain">{r.titulo}</p>
          	<StatusBadge status={r.estado} />
        	</div>

        	<div className="mt-2 flex items-center gap-1.5 text-xs text-textMuted">
          	<Calendar size={12} />
          	<span>{r.fecha}</span>
        	</div>
      	</div>
    	))}
  	</div>

  	{/* CTA */}
  	<Button
    	variant="elevated"
    	size="md"
    	className="mt-4 w-full"
    	onClick={onNuevo}
  	>
    	<Plus size={16} className="mr-1.5" />
    	Nuevo Reclamo
  	</Button>
	</Card>
  );
}

export default OcupanteReclamosList;