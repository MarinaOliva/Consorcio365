import SectionCard from "../dashboard/SectionCard";
import DataTable from "../dashboard/DataTable";
import StatusBadge from "../dashboard/StatusBadge";
import { adminIncidentRows } from "../../data/adminDashboardData";
import { useNavigate } from "react-router-dom";

function AdminRecentIncidents() {
  const navigate = useNavigate();
  const columns = [
    {
      key: "title",
      header: (
        <div className="grid grid-cols-[minmax(0,1fr)_140px_72px] items-center gap-3">
          <span className="font-bold">Título</span>
          <span className="font-bold">Edificio</span>
          <span className="font-bold">Unidad</span>
        </div>
      ),
      render: (row) => (
        <div className="grid grid-cols-[minmax(0,1fr)_140px_72px] items-center gap-3">
          <span className="truncate font-medium text-textMain">
            {row.title}
          </span>

          <span className="truncate text-textMain">
            {row.building}
          </span>

          <span className="truncate text-textMain">
            {row.unit}
          </span>
        </div>

      ),
    },
    {
      key: "status",
      header: (
        <div className="grid grid-cols-[132px_90px] items-center gap-3">
          <span className="font-bold">Estado</span>
          <span className="font-bold">Fecha</span>
        </div>
      ),
      render: (row) => (
        <div className="grid grid-cols-[132px_90px] items-center gap-3">
          <div className="min-w-[132px]">
            <StatusBadge status={row.status} />
          </div>
          
          <span className="whitespace-nowrap text-textMain">
            {row.date}
          </span>
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      title="Incidencias Recientes"
      actionLabel="Ver todas"
      onAction={() => navigate("/admin/incidencias")}
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