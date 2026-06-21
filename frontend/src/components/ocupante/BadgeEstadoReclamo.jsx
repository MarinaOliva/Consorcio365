const LABELS = {
  ABIERTA: "Abierta",
  EN_PROGRESO: "En progreso",
  RESUELTA: "Resuelta",
  CERRADA: "Cerrada",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
};

function BadgeEstadoReclamo({ estado }) {
  const normalizado = String(estado || "").toUpperCase().trim();
  const label = LABELS[normalizado] || estado;

  const estilos = {
	ABIERTA: "border-red-400 bg-red-50 text-red-500",
	EN_PROGRESO: "border-blue-400 bg-blue-50 text-blue-500",
	RESUELTA: "border-emerald-400 bg-emerald-50 text-emerald-600",
	CERRADA: "border-slate-400 bg-slate-100 text-slate-500",
	RECHAZADA: "border-orange-400 bg-orange-50 text-orange-600",
	CANCELADA: "border-slate-400 bg-slate-200 text-slate-600",
  };

  return (
	<span
  	className={`
    	inline-flex items-center rounded-full border px-3 py-1
    	text-[10px] font-bold uppercase
    	${estilos[normalizado] || "border-border bg-white text-textMuted"}
  	`}
	>
  	{label}
	</span>
  );
}

export default BadgeEstadoReclamo;

