import SectionCard from "../dashboard/SectionCard";
import ListItem from "../dashboard/ListItem";

function AdminMaintenanceList({ mantenimientos = [] }) {
  return (
	<SectionCard title="Próximos mantenimientos">
  	{mantenimientos.length > 0 ? (
    	<div className="space-y-4">
      	{mantenimientos.map((item) => (
        	<ListItem
          	key={item.id}
          	icon={item.icon}
          	title={item.title}
          	subtitle={item.subtitle}
          	description={item.description}
        	/>
      	))}
    	</div>
  	) : (
    	<p className="py-4 text-sm text-textMuted">
      	No hay mantenimientos programados.
    	</p>
  	)}
	</SectionCard>
  );
}

export default AdminMaintenanceList;