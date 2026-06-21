function TarjetaDetalleIncidencia({
  title,
  children,
  className = "",
  rightContent = null,
}) {
  return (
    <div
      className={`
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-[3px_5px_8px_rgba(7,40,48,0.22)]
        ${className}
      `}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        {rightContent}
      </div>

      {children}
    </div>
  );
}

export default TarjetaDetalleIncidencia;