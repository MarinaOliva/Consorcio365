function Input({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-textMain mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full
          px-3 py-1
          rounded-md
          bg-surface
          text-textMain
          border border-border
          placeholder:text-textMuted
          focus:outline-none
          focus:ring-1 focus:ring-primary/40
          focus:border-primary
          transition
          
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

export default Input;