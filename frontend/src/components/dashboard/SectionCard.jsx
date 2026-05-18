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
            className={`
              shrink-0 
              px-5 
              py-2 
              text-xs
              shadow-[0_4px_10px_rgba(88,35,103,0.28)]
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(88,35,103,0.38)]
              active:translate-y-0
              active:shadow-[0_3px_8px_rgba(88,35,103,0.25)]
              ${actionButtonClassName}
            `}
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