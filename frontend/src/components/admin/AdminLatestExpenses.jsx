import SectionCard from "../dashboard/SectionCard";
import DataTable from "../dashboard/DataTable";
import StatusBadge from "../dashboard/StatusBadge";
import { adminExpenseRows } from "../../data/adminDashboardData";

function AdminLatestExpenses() {
  const columns = [
    {
      key: "description",
      header: (
        <div className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3">
          <span className="font-bold">Descripción</span>
          <span className="font-bold">Monto</span>
        </div>
      ),

      render: (row) => (
        <div className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3">
          <span className="truncate text-textMain">
            {row.description}
          </span>

          <span className="whitespace-nowrap font-medium text-textMain">
            {row.amount}
          </span>
        </div>
      ),
    },
    {
      key: "origin",
      header: (
        <div className="grid grid-cols-[170px_90px] items-center gap-3">
          <span className="font-bold">Origen</span>
          <span className="font-bold">Fecha</span>
        </div>
      ),

      render: (row) => (
        <div className="grid grid-cols-[170px_90px] items-center gap-3">
          <div className="min-w-[170px]">
            <StatusBadge status={row.origin} />
          </div>

          <span className="whitespace-nowrap text-textMain">
            {row.date}
          </span>
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