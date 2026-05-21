function Button({
  children,
  type = "button",
  onClick,

  // API externa (la dejamos igual para no romper el proyecto)
  variant = "primary", // primary | secondary | danger | ghost | elevated | secondarySolid
  size = "md",         // sm | md | lg

  className = "",
  disabled = false,
}) {
  // Clases base (comunes a todos los botones)
  const base = `
    inline-flex items-center justify-center
    font-semibold
    transition
    focus:outline-none
    focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Tamaños
  const tamanos = {
    sm: "px-4 py-1.5 text-sm rounded-full",
    md: "px-6 py-2 text-sm rounded-full",
    lg: "px-7 py-2.5 text-base rounded-full",
  };

  // Variantes
  const variantes = {
    // Principal (Guardar / acción primaria)
    primary: `
      bg-primary text-white
      hover:bg-primaryHover
      focus:ring-primary/40
      focus:ring-offset-white
    `,

    // Secundario neutral (Cancelar)
    secondary: `
      bg-white/70 text-slate-700
      border border-slate-400
      hover:bg-white hover:border-slate-500
      focus:ring-slate-400/40
      focus:ring-offset-white
    `,

    // Peligro (Eliminar / Bloquear)
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500/40
      focus:ring-offset-white
    `,

    // Suave/ghost (acciones livianas)
    ghost: `
      bg-transparent text-primary
      hover:bg-primarySoft
      focus:ring-primary/25
      focus:ring-offset-white
    `,

    // Variante elevada (para destacar acciones importantes, pero no primarias)
    elevated: `
      bg-primary text-white
      shadow-[0_4px_10px_rgba(88,35,103,0.28)]
      hover:-translate-y-0.5
      hover:shadow-[0_8px_18px_rgba(88,35,103,0.38)]
      active:translate-y-0
      active:shadow-[0_3px_8px_rgba(88,35,103,0.25)]
      transition-all
      focus:ring-primary/50
      focus:ring-offset-white
    `,

    // (Opcional) el "secondary" sólido anterior, por si alguien lo usa en otra pantalla
    secondarySolid: `
      bg-secondary text-white
      hover:bg-secondaryDark
      focus:ring-secondary/40
      focus:ring-offset-white
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${tamanos[size] ?? tamanos.md}
        ${variantes[variant] ?? variantes.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;