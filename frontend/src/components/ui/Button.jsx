function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}) {
  
  //  Variantes de color
  const variants = {
    primary: `
      bg-primary
      hover:bg-primaryHover
      text-white
      focus:ring-primary/40
    `,
    secondary: `
      bg-secondary
      hover:bg-secondaryDark
      text-white
      focus:ring-secondary/40
    `,
    ghost: `
      bg-transparent
      text-primary
      hover:bg-primarySoft
    `,
  };

  //  Tamaños
  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg
        font-semibold
        transition
        focus:outline-none
        focus:ring-2 focus:ring-offset-2
        
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