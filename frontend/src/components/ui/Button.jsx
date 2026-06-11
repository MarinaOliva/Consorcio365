function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary: `
      bg-primary
      text-white
      hover:bg-primaryHover
      focus-visible:ring-primary/40
      focus-visible:ring-offset-white
    `,

    secondary: `
      bg-secondary
      text-white
      hover:bg-secondaryDark
      focus-visible:ring-secondary/40
    `,

    ghost: `
      bg-white/40
      text-primary
      border border-primary
      shadow-sm
      hover:bg-primarySoft
      hover:border-primaryHover
      focus-visible:ring-primary/40
    `,

    neutral: `
      bg-white/70 text-slate-700
      border border-slate-400
      hover:bg-white hover:border-slate-500
      focus-visible:ring-slate-400/40
      focus-visible:ring-offset-white
    `,

    elevated: `
      bg-primary
      text-white
      shadow-[0_4px_10px_rgba(88,35,103,0.28)]
      hover:-translate-y-0.5
      hover:shadow-[0_8px_18px_rgba(88,35,103,0.38)]
      active:translate-y-0
      active:shadow-[0_3px_8px_rgba(88,35,103,0.25)]
      transition-all
      focus-visible:ring-primary/50
      focus-visible:ring-offset-white
    `,
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-sm",
    lg: "px-7 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-full
        font-semibold
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2

        ${variants[variant]}
        ${sizes[size]}

        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;