import DataTable from "../dashboard/DataTable";
import { Eye, Pencil, Trash2 } from "lucide-react";

const TIPO_LABELS = {
  administrador: "ADMINISTRADOR",
  ocupante: "OCUPANTE",
  proveedor: "PROVEEDOR",
};

const ESTADO_LABELS = {
  ACTIVO: "ACTIVO",
  PENDIENTE: "PENDIENTE",
  INACTIVO: "INACTIVO",
};


function AdminUsersTable({
  users = [],
  onEdit = () => {},
  onView = () => {},
  onDelete = () => {},
}) {
  const columns = [
	{
  	key: "name",
  	header: "Nombre",
	},
	{
  	key: "email",
  	header: "Email",
  	render: (row) => (
    	<div className="w-[100px] truncate sm:w-[260px] md:w-[300px]">
      	{row.email}
    	</div>
  	),
	},
	{
	key: "tipo",
	header: "Rol",
	render: (row) => {
		const tipo = row.tipo;
		const label = TIPO_LABELS[tipo] || tipo;
		const tipoStyles = {
		administrador: "bg-blue-50 text-blue-700 border border-blue-400",
		ocupante: "bg-primary/10 text-primary border border-primary/40",
		proveedor: "bg-cyan-50 text-cyan-700 border border-cyan-400",
		};
		return (
		<span
			className={`
			inline-flex items-center rounded-full px-2.5 py-0.5
			text-[10px] font-semibold
			${tipoStyles[tipo] || "bg-gray-100 text-gray-500"}
			`}
		>
			{label}
		</span>
		);
	},
	},
	{
	key: "estado",
	header: "Estado",
	render: (row) => {
		const estado = row.estado;
		const label = ESTADO_LABELS[estado] || estado;
		const estadoStyles = {
		ACTIVO: "bg-emerald-50 text-emerald-600 border border-emerald-400",
		PENDIENTE: "bg-yellow-50 text-yellow-600 border border-yellow-400",
		INACTIVO: "bg-gray-200 text-gray-500 border border-gray-400",
		};
		return (
		<span
			className={`
			inline-flex items-center rounded-full px-2 py-0.5
			text-[10px] font-bold
			${estadoStyles[estado]}
			`}
		>
			{label}
		</span>
		);
	},
	},
	{
  	key: "actions",
  	header: "Acciones",
  	render: (row) => (
    	<div className="flex items-center gap-3">
      	{/* Ver */}
      	<button
        	onClick={() => onView(row)}
        	className="p-1.5 rounded-md text-textMuted hover:text-primary hover:bg-primarySoft transition"
      	>
        	<Eye size={16} />
      	</button>

      	{/* Editar */}
      	<button
        	onClick={() => onEdit(row)}
        	className="p-1.5 rounded-md text-textMuted hover:text-primary hover:bg-primarySoft transition"
      	>
        	<Pencil size={16} />
      	</button>

      	{/* Eliminar */}
      	<button
        	onClick={() => onDelete(row)}
        	className="p-1.5 rounded-md text-textMuted hover:text-red-500 hover:bg-red-100 transition"
      	>
        	<Trash2 size={16} />
      	</button>
    	</div>
  	),
	},
  ];

  return <DataTable columns={columns} rows={users} />;
}

export default AdminUsersTable;

