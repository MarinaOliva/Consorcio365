import SectionCard from "../dashboard/SectionCard";
import DataTable from "../dashboard/DataTable";
import StatusBadge from "../dashboard/StatusBadge";

function AdminLatestExpenses({ gastos = [] }) {
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
  	{gastos.length > 0 ? (
    	<DataTable columns={columns} rows={gastos} />
  	) : (
    	<p className="py-4 text-sm text-textMuted">No hay gastos recientes.</p>
  	)}
	</SectionCard>
  );
}

export default AdminLatestExpenses;