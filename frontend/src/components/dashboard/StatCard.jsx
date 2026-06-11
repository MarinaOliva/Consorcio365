import Card from "../ui/Card";

function StatCard({
  title,
  value,
  trend,
  trendType = "positive",
  icon,
}) {
  const Icon = icon;

  const trendClasses = {
    positive: "text-emerald-600",
    negative: "text-red-500",
    neutral: "text-textMuted",
  };

  return (
    <Card className="min-h-[118px] border-secondary/70 bg-white p-4 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-textMuted">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold leading-none text-primary">
            {value}
          </p>

          {trend && (
            <p className={`mt-3 text-[11px] font-semibold ${trendClasses[trendType]}`}>
              {trendType === "negative" ? "↓" : "↑"} {trend}
            </p>
          )}
        </div>

        {Icon && (
          <div className="text-primary/80">
            <Icon
              size={28}
              strokeWidth={2}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;