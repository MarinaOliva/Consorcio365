function SelectEditable({ label, value, onChange, options = [] }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-textMuted">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full rounded-lg border border-border bg-white
          px-3 py-2 text-sm font-semibold text-textMain
          outline-none transition
          focus:border-primary focus:ring-2 focus:ring-primary/20
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectEditable;