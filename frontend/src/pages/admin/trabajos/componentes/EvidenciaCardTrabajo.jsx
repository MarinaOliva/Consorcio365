import { FileText, ImageIcon } from "lucide-react";

function EvidenciaCardTrabajo({ evidencia }) {
  if (evidencia.tipo === "pdf") {
    return (
      <button
        type="button"
        className="
          flex h-24 min-w-[140px] flex-col items-center justify-center rounded-lg
          border border-red-200 bg-red-50 text-red-500 transition
          hover:border-red-300 hover:bg-red-100
        "
      >
        <FileText size={24} />

        <span className="mt-1 text-xs font-black uppercase">PDF</span>

        <span className="mt-1 max-w-[110px] truncate text-[10px] text-red-300">
          {evidencia.titulo}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`
        flex h-24 min-w-[140px] items-end overflow-hidden rounded-lg
        border border-border/70 bg-gradient-to-br ${evidencia.className}
        p-2 shadow-sm transition hover:scale-[1.02]
      `}
    >
      <div className="flex w-full items-center gap-1.5 rounded-md bg-white/75 px-2 py-1 text-[10px] font-semibold text-textMain">
        <ImageIcon size={13} className="text-primary" />
        <span className="truncate">{evidencia.titulo}</span>
      </div>
    </button>
  );
}

export default EvidenciaCardTrabajo;