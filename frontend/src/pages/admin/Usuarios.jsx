import { useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import SectionCard from "../../components/dashboard/SectionCard";

import AdminUsersToolbar from "../../components/admin/AdminUsersToolbar";
import AdminUsersTable from "../../components/admin/AdminUsersTable";

import { adminUsers } from "../../data/adminUsersData";
import { adminMenuItems, adminUser } from "../../data/adminDashboardData";

import EditEntityModal from "../../components/admin/EditEntityModal";
import SuccessModal from "../../components/shared/SuccessModal";


function UsuariosAdmin() {
  
const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Fuente de verdad: estado (para que se reflejen los cambios al guardar)
  const [users, setUsers] = useState(adminUsers);

  // Modal + borrador editable
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  // Abrir modal: se clona el user para editar sin mutar el original, se guarda en draft
  const handleEdit = (user) => {
   const copy =
    typeof structuredClone === "function"
      ? structuredClone(user)
      : JSON.parse(JSON.stringify(user));

   setDraft(copy);
   setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDraft(null);
  };

  // Guardar: recibe lo editado y lo persiste en users
  const handleSave = (updatedEntity) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedEntity.id ? updatedEntity : u))
    );

    handleCloseModal();
    setIsSuccessOpen(true);
  };

  // Filtrado: ahora se hace sobre users (estado)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "Todos" || user.role === roleFilter;
    const matchesStatus = statusFilter === "Todos" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });


  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      user={adminUser}
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
          <AdminUsersTable users={filteredUsers} onEdit={handleEdit} />
        </SectionCard>

      </section>

      <EditEntityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        draft={draft}
        setDraft={setDraft}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </DashboardLayout>
  );
}

export default UsuariosAdmin;