import SectionCard from "../dashboard/SectionCard";
import DataTable from "../dashboard/DataTable";
import StatusBadge from "../dashboard/StatusBadge";
import { adminIncidentRows } from "../../data/adminDashboardData";

function AdminRecentIncidents() {
  const columns = [
    {
      key: "title",
      header: "Título - Edificio - Unidad",
      render: (row) => (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>{row.title}</span>
          <span>-</span>
          <span>{row.building}</span>
          <span>-</span>
          <span>{row.unit}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Estado - Fecha",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          <span>{row.date}</span>
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      title="Incidencias Recientes"
      actionLabel="Ver todas"
      actionButtonClassName="hover:bg-primaryHover hover:scale-[1.03]"
    >
      <DataTable
        columns={columns}
        rows={adminIncidentRows}
      />
    </SectionCard>
  );
}

export default AdminRecentIncidents;