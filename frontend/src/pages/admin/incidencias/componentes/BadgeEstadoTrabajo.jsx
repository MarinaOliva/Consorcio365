function BadgeEstadoTrabajo({ estado }) {
  const normalizado = estado?.toLowerCase();

  const estilos = {
    asignado: "border-blue-400 bg-blue-50 text-blue-500",
    programado: "border-primary/40 bg-primary/10 text-primary",
    finalizado: "border-emerald-400 bg-emerald-50 text-emerald-600",
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