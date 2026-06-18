function BadgePrioridad({ prioridad }) {
  const normalizado = prioridad?.toLowerCase();

  const estilos = {
    alta: "border-red-400 bg-red-50 text-red-500",
    media: "border-yellow-400 bg-yellow-50 text-yellow-600",
    baja: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {prioridad}
    </span>
  );
}

export default BadgePrioridad;