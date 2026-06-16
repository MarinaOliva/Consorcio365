import { useEffect, useMemo, useState } from "react";
import NuevoUsuarioModal from "../../components/admin/NuevoUsuarioModal";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";

import AdminUsersToolbar from "../../components/admin/AdminUsersToolbar";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import EditEntityModal from "../../components/admin/EditEntityModal";
import SuccessModal from "../../components/shared/SuccessModal";

import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  createUsuario,
} from "../../services/usersService";

function UsuariosAdmin() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  
  
  // Modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modal de éxito
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Cambios guardados con éxito"
  );

  useEffect(() => {
    let activo = true;

    async function cargarUsuarios() {
      try {
        const data = await getUsuarios();

        if (!activo) return;

        const adapted = data.map((u) => ({
          ...u,
          id: u._id || u.id, 
          displayName: `${u.nombre|| ""} ${u.apellido|| ""}`.trim(),
        }));

        setUsers(adapted);
      } catch (err) {
        if (!activo) return;

        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "No se pudieron cargar los usuarios";

        setError(msg);
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargarUsuarios();

    return () => {
      activo = false;
    };
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

  // Soft delete: pasa a INACTIVO
const handleDelete = async (row) => {
  const confirmar = window.confirm(
	`¿Desactivar a ${row.displayName || row.nombre}?`
  );
  if (!confirmar) return;
  try {
	await deleteUsuario(row.id);
	setUsers((prev) =>
  	prev.map((u) =>
    	u.id === row.id ? { ...u, estado: "INACTIVO" } : u
  	)
	);
	setSuccessMessage("Usuario desactivado con éxito");
	setIsSuccessOpen(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo desactivar el usuario";

      alert(msg);
    }
  };

  // Guardar edición (PUT al back)
 const handleSave = async (updatedEntity) => {
  try {
	const payload = { ...updatedEntity };
	delete payload.id;
	delete payload._id;
	delete payload.displayName;

	const result = await updateUsuario(updatedEntity.id, payload);
	setUsers((prev) =>
  	prev.map((u) =>
    	u.id === updatedEntity.id
      	? {
          	...result,
          	id: result._id || result.id,
          	displayName: `${result.nombre || ""} ${result.apellido || ""}`.trim(),
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

 // Alta del nuevo usuario
  
 const handleCreateUser = async (nuevoUsuario) => {
  try {
	const payload = { ...nuevoUsuario };
	const passwordTemporal = payload.passwordTemporal || "Temporal123!";
	delete payload.passwordTemporal;

	const created = await createUsuario(payload, passwordTemporal);
	const adapted = {
  	...created,
  	id: created._id || created.id,
  	displayName: `${created.nombre || ""} ${created.apellido || ""}`.trim(),
	};
	setUsers((prev) => [adapted, ...prev]);
	setIsCreateModalOpen(false);
	setSuccessMessage("Usuario creado con éxito");
	setIsSuccessOpen(true);
  } catch (err) {
	const msg =
  	err?.response?.data?.message ||
  	err?.message ||
  	"No se pudo crear el usuario";
	alert(msg);
  }
};


  // Filtrado sobre la lista
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "todos" || u.tipo === roleFilter;
      const matchesStatus =
        statusFilter === "todos" || u.estado === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Adaptación final para la tabla
  const tableRows = useMemo(() => {
    return filteredUsers.map((u) => ({
      ...u,
      name: u.displayName, // la tabla lee "name"
    }));
  }, [filteredUsers]);

  // crear nuevo usuario (modal en modo edición pero sin draft previo)
  /*const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);*/

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };


  return (
    <ContenedorPanelPorRol
      titulo="Usuarios"
      subtitulo="Gestión de usuarios del sistema"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <AdminUsersToolbar
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onNuevoUsuario={handleOpenCreateModal}
        />

        <SectionCard title="Lista de usuarios">
          {loading && (
            <p className="py-4 text-sm text-textMuted">
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
	    
      {isCreateModalOpen && (
        <NuevoUsuarioModal
          onClose={handleCloseCreateModal}
          onCreate={handleCreateUser}
        />
      )}

    </ContenedorPanelPorRol>
    
  );
}

export default UsuariosAdmin;