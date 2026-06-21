function normalizarTipo(tipo) {
  return String(tipo ?? "").trim().toLowerCase();
}

const TIPO_LABELS = {
  reglamento: "Reglamento",
  acta: "Acta",
  informe: "Informe",
  plano: "Plano",
  contrato: "Contrato",
  otro: "Otro",
};

function BadgeTipoDocumento({ tipo = "" }) {
  const variantes = {
	reglamento: "border-red-800 bg-red-100 text-red-800",
	acta: "border-yellow-800 bg-yellow-100 text-yellow-800",
	informe: "border-blue-800 bg-blue-100 text-blue-900",
	plano: "border-purple-800 bg-purple-100 text-purple-800",
	contrato: "border-green-800 bg-green-100 text-green-800",
	otro: "border-slate-600 bg-slate-100 text-slate-700",
  };

  const tipoNormalizado = normalizarTipo(tipo);
  const label = TIPO_LABELS[tipoNormalizado] || tipo;

  return (
	<span
  	className={`
    	inline-flex items-center rounded-full border px-2.5 py-0.5
    	text-[10px] font-bold uppercase
    	${variantes[tipoNormalizado] || "border-slate-400 bg-slate-100 text-slate-600"}
  	`}
	>
  	{label}
	</span>
  );
}

export default BadgeTipoDocumento;