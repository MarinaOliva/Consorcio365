function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  const variants = {
	abierta: "border-red-400 bg-red-50 text-red-500",
	"en trabajo": "border-blue-400 bg-blue-50 text-blue-500",
	resuelta: "border-emerald-400 bg-emerald-50 text-emerald-500",
	trabajo: "border-orange-400 bg-orange-50 text-orange-500",
	mantenimiento: "border-pink-400 bg-pink-50 text-pink-500",
	asignado: "border-orange-400 bg-orange-50 text-orange-500",
	"en progreso": "border-blue-400 bg-blue-50 text-blue-500",
	finalizado: "border-emerald-400 bg-emerald-50 text-emerald-500",
	reactivo: "border-orange-400 bg-orange-50 text-orange-500",
	preventivo: "border-pink-400 bg-pink-50 text-pink-500",
	manual: "border-violet-400 bg-violet-50 text-violet-500",
};


  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${variants[normalizedStatus] || "border-border bg-white text-textMuted"}
      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;