function ListItem({
  icon,
  title,
  subtitle,
  description,
  rightContent,
}) {
  const Icon = icon;

  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-300/50 p-3">
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primarySoft text-primary">
          <Icon
            size={17}
            strokeWidth={2}
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-textMain">
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-xs text-textMuted">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-[11px] text-textMuted">
            {description}
          </p>
        )}
      </div>

      {rightContent && (
        <div className="shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}

export default ListItem;