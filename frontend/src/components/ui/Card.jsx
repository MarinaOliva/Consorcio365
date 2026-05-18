function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-surface
        border border-secondary/80
        rounded-xl
        shadow-card
        p-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;