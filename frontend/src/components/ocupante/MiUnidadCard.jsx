import { DoorOpen } from "lucide-react";
import Card from "../ui/Card";
import { miUnidadMock } from "../../data/ocupanteDashboardData";

function MiUnidadCard({ unidad = miUnidadMock }) {
  return (
	<Card className="border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
  	<div className="flex items-center justify-between gap-4">
    	<div className="flex items-center gap-3">
      	<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primarySoft text-primary">
        	<DoorOpen size={22} />
      	</div>

      	<div>
        	<p className="text-xs font-medium text-textMuted">Mi Unidad</p>
        	<p className="mt-0.5 text-base text-textMain">
          	<span className="font-bold">{unidad.numero}</span>
          	<span className="mx-2 text-textMuted">•</span>
          	<span>{unidad.piso}</span>
          	<span className="mx-2 text-textMuted">•</span>
          	<span>{unidad.torre}</span>
        	</p>
      	</div>
    	</div>

    	<span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
      	{unidad.relacion}
    	</span>
  	</div>
	</Card>
  );
}

export default MiUnidadCard;

