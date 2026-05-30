// src/components/dashboard/SectionCard.jsx

import Card from "../ui/Card";
import Button from "../ui/Button";

function SectionCard({
  title,
  children,
  actionLabel,
  onAction,
  actionButtonClassName = "",
  className = "",
}) {
  return (
    <Card
      className={`
        border-secondary/70
        bg-white
        p-4
        shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
        ${className}
      `}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-primary">
          {title}
        </h2>

        {actionLabel && (
          <Button
            size="sm"
            onClick={onAction}
            variant="elevated"
            className={actionButtonClassName}
          >
            {actionLabel}
          </Button>
        )}
      </div>

      {children}
    </Card>
  );
}

export default SectionCard;