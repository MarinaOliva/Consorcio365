import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import SectionCard from "../../components/dashboard/SectionCard";

import AdminUsersToolbar from "../../components/admin/AdminUsersToolbar";
import AdminUsersTable from "../../components/admin/AdminUsersTable";


import { useAuth } from "../../hooks/useAuth";
import { adminMenuItems } from "../../data/adminDashboardData";
import EditEntityModal from "../../components/admin/EditEntityModal";
import SuccessModal from "../../components/shared/SuccessModal";

import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
} from "../../services/usersService";

function UsuariosAdmin() {
  const { user: authUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  // Modal de éxito
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Cambios guardados con éxito");

  // Datos del header (admin logueado)
  const displayUser = useMemo(() => {
	if (!authUser) return null;
	const ROLE_LABELS = {
  	admin: "Administrador",
  	ocupante: "Ocupante",
  	proveedor: "Proveedor",
	};
	return {
  	name: authUser.name,
  	role: ROLE_LABELS[authUser.role] || authUser.role,
	};
  }, [authUser]);

  // Cargar usuarios desde el back
  const loadUsers = async () => {
	setLoading(true);
	setError("");
	try {
  	const data = await getUsuarios();
  	const adapted = data.map((u) => ({
    	...u,
    	displayName: `${u.name} ${u.lastName}`.trim(),
  	}));
  	setUsers(adapted);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudieron cargar los usuarios";
  	setError(msg);
	} finally {
  	setLoading(false);
	}
  };

  useEffect(() => {
	loadUsers();
  }, []);


  // Editar (modal en modo edición)
 
  const handleEdit = (row) => {
	const copy =
  	typeof structuredClone === "function"
    	? structuredClone(row)
    	: JSON.parse(JSON.stringify(row));
	setDraft(copy);
	setReadOnly(false);
	setIsModalOpen(true);
  };

  
  // Ver (modal en modo solo lectura)
 
  const handleView = (row) => {
	const copy =
  	typeof structuredClone === "function"
    	? structuredClone(row)
    	: JSON.parse(JSON.stringify(row));
	setDraft(copy);
	setReadOnly(true);
	setIsModalOpen(true);
  };

 
  //soft delete: pasa a INACTIVO
 
  const handleDelete = async (row) => {
	const confirmar = window.confirm(
  	`¿Desactivar a ${row.displayName || row.name}?`
	);
	if (!confirmar) return;

	try {
  	await deleteUsuario(row.id);
  	setUsers((prev) =>
    	prev.map((u) =>
      	u.id === row.id ? { ...u, status: "Inactivo" } : u
    	)
  	);
  	setSuccessMessage("Estado cambiado con éxito");
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo desactivar el usuario";
  	alert(msg);
	}
  };

  
  // Guardar (PUT al back)
  
  const handleSave = async (updatedEntity) => {
	try {
  	await updateUsuario(updatedEntity.id, updatedEntity);

  	// Actualizamos la lista localmente
  	setUsers((prev) =>
    	prev.map((u) =>
      	u.id === updatedEntity.id
        	? {
            	...updatedEntity,
            	displayName: `${updatedEntity.name} ${updatedEntity.lastName}`.trim(),
          	}
        	: u
    	)
  	);

  	handleCloseModal();
  	setSuccessMessage("Cambios guardados con éxito");
  	setIsSuccessOpen(true);
	} catch (err) {
  	const msg =
    	err?.response?.data?.message ||
    	err?.message ||
    	"No se pudo guardar el usuario";
  	alert(msg);
	}
  };

  const handleCloseModal = () => {
	setIsModalOpen(false);
	setDraft(null);
	setReadOnly(false);
  };

 
  // Filtrado (local sobre la lista)
 
  const filteredUsers = users.filter((u) => {
	const matchesSearch =
  	(u.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
  	(u.email || "").toLowerCase().includes(search.toLowerCase());

	const matchesRole = roleFilter === "Todos" || u.role === roleFilter;
	const matchesStatus = statusFilter === "Todos" || u.status === statusFilter;

	return matchesSearch && matchesRole && matchesStatus;
  });

  
  // Adaptación final para la tabla

  const tableRows = filteredUsers.map((u) => ({
	...u,
	name: u.displayName, // la tabla lee "name"
  }));

  return (
	<DashboardLayout
  	menuItems={adminMenuItems}
  	user={displayUser}
  	title="Usuarios"
  	subtitle="Gestión de usuarios del sistema"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<AdminUsersToolbar
      	search={search}
      	setSearch={setSearch}
      	roleFilter={roleFilter}
      	setRoleFilter={setRoleFilter}
      	statusFilter={statusFilter}
      	setStatusFilter={setStatusFilter}
    	/>

    	<SectionCard title="Lista de usuarios">
      	{loading && (
        	<p className="text-sm text-textMuted py-4">
          	Cargando usuarios...
        	</p>
      	)}

      	{error && (
        	<div className="rounded-md border border-red-200 bg-red-50 p-3">
          	<p className="text-sm text-red-600">{error}</p>
        	</div>
      	)}

      	{!loading && !error && (
        	<AdminUsersTable
          	users={tableRows}
          	onEdit={handleEdit}
          	onView={handleView}
          	onDelete={handleDelete}
        	/>
      	)}
    	</SectionCard>
  	</section>

  	<EditEntityModal
    	isOpen={isModalOpen}
    	onClose={handleCloseModal}
    	onSave={handleSave}
    	draft={draft}
    	setDraft={setDraft}
    	readOnly={readOnly}
  	/>

  	<SuccessModal
    	isOpen={isSuccessOpen}
    	onClose={() => setIsSuccessOpen(false)}
    	message={successMessage}
  	/>
	</DashboardLayout>
  );
}

export default UsuariosAdmin;

