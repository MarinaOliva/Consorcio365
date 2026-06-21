function TarjetaDetalle({
  title,
  children,
  className = "",
  titleAlign = "left",
}) {
  return (
    <div
      className={`
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-none
        ${className}
      `}
    >
      <h3
        className={`
          mb-4 text-sm font-bold text-primary
          ${titleAlign === "center" ? "text-center" : "text-left"}
        `}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

export default TarjetaDetalle;