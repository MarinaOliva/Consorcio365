function BadgeEstadoReclamo({ estado }) {
  const normalizado = String(estado || "").toLowerCase().trim();

  const estilos = {
    abierta: "border-red-400 bg-red-50 text-red-500",
    "en trabajo": "border-blue-400 bg-blue-50 text-blue-500",
    resuelta: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrada: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-3 py-1
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

export default BadgeEstadoReclamo;