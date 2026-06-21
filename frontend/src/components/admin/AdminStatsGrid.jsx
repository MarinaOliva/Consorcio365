import StatCard from "../dashboard/StatCard";

function AdminStatsGrid({ stats = [] }) {
  return (
	<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  	{stats.map((stat) => (
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