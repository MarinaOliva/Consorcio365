import StatCard from "../dashboard/StatCard";
import { adminStats } from "../../data/adminDashboardData";

function AdminStatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {adminStats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          trendType={stat.trendType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

export default AdminStatsGrid;