export default function RadioGroup({
  label,
  name,
  value,
  options = [],
  onChange,
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>

      <div className="flex flex-wrap gap-6">
        {options.map((opt) => {
          const checked = value === opt;

          return (
            <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange?.(opt)}
                className="
                  relative h-4 w-4
                  appearance-none rounded-full
                  border-2 border-slate-500
                  bg-white
                  transition
                  focus:outline-none focus:ring-1 focus:ring-[#582367]

                  checked:border-[#582367]

                  checked:after:content-['']
                  checked:after:absolute
                  checked:after:inset-[3px]
                  checked:after:rounded-full
                  checked:after:bg-[#582367]
                "
              />
              <span className="select-none">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}