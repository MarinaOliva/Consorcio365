import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            w-full appearance-none rounded-lg
            bg-white
            border border-slate-300
            px-4 py-3 pr-11
            text-sm text-slate-800
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-purple-400/40
            disabled:bg-white disabled:text-slate-700 disabled:opacity-100
          "
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron derecho */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f5b66]">
          <ChevronDown size={18} />
        </span>
      </div>
    </div>
  );
}
