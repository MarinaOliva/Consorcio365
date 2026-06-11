import SectionCard from "../dashboard/SectionCard";
import ListItem from "../dashboard/ListItem";
import { adminMaintenanceItems } from "../../data/adminDashboardData";

function AdminMaintenanceList() {
  return (
    <SectionCard title="Próximos mantenimientos">
      <div className="space-y-4">
        {adminMaintenanceItems.map((item) => (
          <ListItem
            key={item.id}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
          />
        ))}
      </div>
    </SectionCard>
  );
}

export default AdminMaintenanceList;