import {
  etiquetaEstadoUnidad,
  normalizarEstadoUnidad,
} from "../utils/normalizarEstadoUnidad";

function BadgeEstado({ estado }) {
  const normalizadoUnidad = normalizarEstadoUnidad(estado);
  const normalizadoGeneral = String(estado || "").trim().toLowerCase();

  const valor = ["ocupada", "desocupada"].includes(normalizadoUnidad)
    ? normalizadoUnidad
    : normalizadoGeneral;

  const estilos = {
    ocupada: "border-emerald-400 bg-emerald-50 text-emerald-600",
    desocupada: "border-slate-400 bg-slate-100 text-slate-500",
    "en refacción": "border-orange-400 bg-orange-50 text-orange-600",
	  "en refaccion": "border-orange-400 bg-orange-50 text-orange-600",

    abierta: "border-red-400 bg-red-50 text-red-500",
    resuelta: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrada: "border-slate-400 bg-slate-100 text-slate-500",

    vigente: "border-emerald-400 bg-emerald-50 text-emerald-600",
    finalizado: "border-slate-400 bg-slate-100 text-slate-500",

    propietario: "border-cyan-400 bg-cyan-50 text-cyan-700",
    inquilino: "border-primary/40 bg-primary/10 text-primary",
  };

  const texto =
    valor === "ocupada" || valor === "desocupada"
      ? etiquetaEstadoUnidad(estado)
      : estado;

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[valor] || "border-border bg-white text-textMuted"}
      `}
    >
      {texto}
    </span>
  );
}

export default BadgeEstado;