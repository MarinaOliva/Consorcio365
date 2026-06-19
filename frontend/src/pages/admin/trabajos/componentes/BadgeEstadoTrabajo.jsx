function BadgeEstadoTrabajo({ estado }) {
  const normalizado = String(estado ?? "").toLowerCase().trim();

  const estilos = {
    asignado: "border-yellow-400 bg-yellow-50 text-yellow-600",
    "en progreso": "border-blue-400 bg-blue-50 text-blue-500",
    finalizado: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrado: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

export default BadgeEstadoTrabajo;