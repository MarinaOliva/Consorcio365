import { ImageIcon } from "lucide-react";

function EvidenciaPreview({ evidencia, index }) {
  if (evidencia?.url) {
	return (
  	<a href={evidencia.url}
    	target="_blank"
    	rel="noopener noreferrer"
    	className="flex h-24 min-w-[140px] flex-col overflow-hidden rounded-lg border border-border/70 bg-cover bg-center shadow-sm transition hover:scale-[1.02]"
    	style={{ backgroundImage: `url(${evidencia.url})` }}
  	>
    	<div className="mt-auto flex w-full items-center gap-2 bg-white/75 px-3 py-2 text-[11px] font-bold text-textMain">
      	<ImageIcon size={13} className="text-primary" />
      	<span className="truncate">{evidencia.label}</span>
    	</div>
  	</a>
	);
  }

  const fondos = [
	"from-cyan-50 via-slate-100 to-teal-100",
	"from-slate-100 via-gray-100 to-stone-200",
	"from-orange-50 via-amber-100 to-stone-200",
  ];

  return (
	<div
  	className={`
    	flex h-24 min-w-[140px] items-end overflow-hidden rounded-lg
    	border border-border/70 bg-gradient-to-br
    	${fondos[index % fondos.length]}
  	`}
	>
  	<div className="flex w-full items-center gap-2 bg-white/75 px-3 py-2 text-[11px] font-bold text-textMain backdrop-blur-sm">
    	<ImageIcon size={13} className="text-primary" />
    	<span className="truncate">{evidencia?.label || "Sin imagen"}</span>
  	</div>
	</div>
  );
}

export default EvidenciaPreview;

