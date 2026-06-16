function normalizarTipo(tipo) {
  return String(tipo ?? "").trim().toLowerCase();
}

function BadgeTipoDocumento({ tipo = "" }) {
  const variantes = {
    reglamento: "border-red-800 bg-red-100 text-red-800",
    acta: "border-yellow-800 bg-yellow-100 text-yellow-800",
    informe: "border-blue-800 bg-blue-100 text-blue-900",
  };

  const tipoNormalizado = normalizarTipo(tipo);

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5
        text-[10px] font-bold uppercase
        ${variantes[tipoNormalizado] || "border-slate-400 bg-slate-100 text-slate-600"}
      `}
    >
      {tipo}
    </span>
  );
}

export default BadgeTipoDocumento;