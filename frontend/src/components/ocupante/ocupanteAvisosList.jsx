import { Calendar } from "lucide-react";
import Card from "../ui/Card";
import { avisosMock } from "../../data/ocupanteDashboardData";

const PRIORIDAD_BORDER = {
  alta:  "border-l-red-400",
  media: "border-l-blue-400",
  baja:  "border-l-gray-400",
};

function OcupanteAvisosList({ avisos = avisosMock, onVerTodos = () => {} }) {
  return (
	<Card className="border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
  	{/* Header */}
  	<div className="mb-3 flex items-center justify-between gap-4">
    	<h2 className="text-base font-bold text-primary">Avisos del Edificio</h2>
    	<button
      	onClick={onVerTodos}
      	className="text-xs font-semibold text-primary hover:underline"
    	>
      	Ver todos
    	</button>
  	</div>

  	{/* Lista */}
  	<div className="space-y-3">
    	{avisos.map((a) => (
      	<div
        	key={a.id}
        	className={`
          	rounded-md border border-border/60 border-l-4
          	bg-surfaceSoft/40 p-3
          	${PRIORIDAD_BORDER[a.prioridad] || "border-l-gray-300"}
        	`}
      	>
        	<p className="text-sm font-semibold text-textMain">{a.titulo}</p>
        	<p className="mt-1 text-xs leading-relaxed text-textMuted">
          	{a.descripcion}
        	</p>

        	<div className="mt-2 flex items-center gap-1.5 text-[11px] text-textMuted">
          	<Calendar size={12} />
          	<span>Publicado: {a.fecha}</span>
        	</div>
      	</div>
    	))}
  	</div>
	</Card>
  );
}

export default OcupanteAvisosList;

