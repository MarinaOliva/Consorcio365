import SectionCard from "../dashboard/SectionCard";
import DataTable from "../dashboard/DataTable";
import StatusBadge from "../dashboard/StatusBadge";
import { adminExpenseRows } from "../../data/adminDashboardData";

function AdminLatestExpenses() {
  const columns = [
    {
      key: "description",
      header: "Descripción - Monto",
      render: (row) => (
        <span>
          {row.description} - {row.amount}
        </span>
      ),
    },
    {
      key: "origin",
      header: "Origen - Fecha",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.origin} />
          <span>{row.date}</span>
        </div>
      ),
    },
  ];

  return (
    <SectionCard title="Últimos Gastos">
      <DataTable
        columns={columns}
        rows={adminExpenseRows}
      />
    </SectionCard>
  );
}

export default AdminLatestExpenses;