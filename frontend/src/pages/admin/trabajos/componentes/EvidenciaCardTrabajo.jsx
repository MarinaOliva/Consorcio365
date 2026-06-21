import { FileText, ImageIcon } from "lucide-react";

function EvidenciaCardTrabajo({ evidencia }) {
  if (evidencia.tipo === "pdf") {
	return (
  	<a
    	href={evidencia.url}
    	target="_blank"
    	rel="noopener noreferrer"
    	className="
      	flex h-24 min-w-[140px] flex-col items-center justify-center rounded-lg
      	border border-red-200 bg-red-50 text-red-500 transition
      	hover:border-red-300 hover:bg-red-100
    	"
  	>
    	<FileText size={24} />

    	<span className="mt-1 text-xs font-black uppercase">PDF</span>

    	<span className="mt-1 max-w-[110px] truncate text-[10px] text-red-400">
      	{evidencia.titulo}
    	</span>
  	</a>
	);
  }

  return (
	<a
  	href={evidencia.url}
  	target="_blank"
  	rel="noopener noreferrer"
  	className="
    	flex h-24 min-w-[140px] flex-col overflow-hidden rounded-lg
    	border border-border/70 bg-cover bg-center
    	shadow-sm transition hover:scale-[1.02]
  	"
  	style={
    	evidencia.url ? { backgroundImage: `url(${evidencia.url})` } : undefined
  	}
	>
  	<div className="mt-auto flex w-full items-center gap-1.5 bg-white/75 px-2 py-1 text-[10px] font-semibold text-textMain">
    	<ImageIcon size={13} className="text-primary" />
    	<span className="truncate">{evidencia.titulo}</span>
  	</div>
	</a>
  );
}

export default EvidenciaCardTrabajo;