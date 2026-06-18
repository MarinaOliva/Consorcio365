import { Pencil } from "lucide-react";

const ESTADOS_TRABAJO = ["Asignado", "En progreso", "Finalizado", "Cerrado"];

function EstadoTrabajoSelect({ value, onChange }) {
  const normalizado = String(value ?? "").toLowerCase().trim();

  const estilos = {
    asignado:
      "border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
    "en progreso":
      "border-blue-400 bg-blue-50 text-blue-500 hover:bg-blue-100",
    finalizado:
      "border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    cerrado: "border-slate-400 bg-slate-100 text-slate-500 hover:bg-slate-200",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          cursor-pointer rounded-full border px-4 py-1
          text-[10px] font-bold uppercase outline-none transition-colors
          focus:ring-2 focus:ring-primary/20
          ${
            estilos[normalizado] ||
            "border-border bg-white text-textMuted hover:bg-surfaceSoft"
          }
        `}
      >
        {ESTADOS_TRABAJO.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>

      <Pencil size={20} className="shrink-0 text-primary" />
    </div>
  );
}

export default EstadoTrabajoSelect;