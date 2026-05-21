import { Pencil } from "lucide-react";

export default function EditableInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  readOnly = false,
  showIcon = true,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="relative">
        <input
          type={type}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            w-full rounded-lg
            bg-white
            border border-slate-300
            px-4 py-3 pr-11
            text-sm text-slate-800
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-purple-900/40
            disabled:bg-white disabled:text-slate-700 disabled:opacity-100
            read-only:bg-white read-only:text-slate-700
          "
        />

        {showIcon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-600">
            <Pencil size={16} />
          </span>
        )}
      </div>
    </div>
  );
}