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
  
  const handleSave = () => {
  setIsModalOpen(false);
  setIsSuccessOpen(true);
  };

  // filtrado
  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "Todos" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "Todos" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

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
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        entity={selectedUser}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </DashboardLayout>
  );
}

export default UsuariosAdmin;