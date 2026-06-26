import { mostrarToastError } from "../../utils/toasts";

import { useEffect, useMemo, useState } from "react";
import NuevoUsuarioModal from "../../components/admin/NuevoUsuarioModal";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";

import AdminUsersToolbar from "../../components/admin/AdminUsersToolbar";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import EditEntityModal from "../../components/admin/EditEntityModal";
import SuccessModal from "../../components/shared/SuccessModal";
import ModalConfirmacion from "../../components/shared/ModalConfirmacion";

import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  createUsuario,
} from "../../services/usersService";
import { getUnidades, vincularOcupante, desvincularOcupante } from "../../services/unidadesService";

function UsuariosAdmin() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [users, setUsers] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isConfirmarDesactivacionOpen, setIsConfirmarDesactivacionOpen] = useState(false);
  const [usuarioADesactivar, setUsuarioADesactivar] = useState(null);

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
      const [data, unidadesData] = await Promise.all([
        getUsuarios(),
        getUnidades(),
      ]);

  	if (!activo) return;
  	setUnidades(unidadesData);


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

  // Busca la unidad actual del ocupante
  const buscarRelacionActual = (ocupanteId) => {
    for (const unidad of unidades) {
    const relacion = unidad.unidadRelaciones?.find(
      (rel) =>
        rel.esOcupanteActual === true &&
        rel.estado === "VIGENTE" &&
        (rel.ocupanteId?._id === ocupanteId || rel.ocupanteId === ocupanteId)
    );
    if (relacion) {
      return {
        unidadId: unidad._id,
        relacionId: relacion._id,
        rolEnUnidad: relacion.rolEnUnidad,
      };
    }
    }
    return null;
  };

  // Editar (modal en modo edición)
const handleEdit = (row) => {
  const copy = structuredClone(row);
  if (row.tipo === "ocupante") {
	const relacion = buscarRelacionActual(row.id);
	if (relacion) {
  	copy.unit = relacion.unidadId;
  	copy.unitRole = relacion.rolEnUnidad;
  	copy._relacionActual = relacion;
	}
  }
  setDraft(copy);
  setReadOnly(false);
  setIsModalOpen(true);
};

// Ver (modal en modo solo lectura)
const handleView = (row) => {
  const copy = structuredClone(row);
  if (row.tipo === "ocupante") {
	const relacion = buscarRelacionActual(row.id);
	if (relacion) {
  	copy.unit = relacion.unidadId;
  	copy.unitRole = relacion.rolEnUnidad;
	}
  }
  setDraft(copy);
  setReadOnly(true);
  setIsModalOpen(true);
};

  // Soft delete: pasa a INACTIVO
  const handleDelete = (row) => {
    setUsuarioADesactivar(row);
    setIsConfirmarDesactivacionOpen(true);
  };

  const handleCancelarDesactivacion = () => {
    setUsuarioADesactivar(null);
    setIsConfirmarDesactivacionOpen(false);
  };

  const handleConfirmarDesactivacion = async () => {
    if (!usuarioADesactivar) return;

    try {
      await deleteUsuario(usuarioADesactivar.id);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === usuarioADesactivar.id ? { ...u, estado: "INACTIVO" } : u,
        ),
      );

      setIsConfirmarDesactivacionOpen(false);
      setUsuarioADesactivar(null);

      setSuccessMessage("Usuario desactivado con éxito");
      setIsSuccessOpen(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo desactivar el usuario";

      setIsConfirmarDesactivacionOpen(false);
      setUsuarioADesactivar(null);

      mostrarToastError(msg);
    }
  };

  // Guardar edición (PUT al back)
  const handleSave = async (updatedEntity) => {
  try {
	const payload = { ...updatedEntity };

	const nuevaUnidad = payload.unit;
	const nuevoRol = payload.unitRole || "PROPIETARIO";  // default si no se eligió
	const relacionActual = payload._relacionActual;

	console.log("[handleSave] nuevaUnidad:", nuevaUnidad);
	console.log("[handleSave] nuevoRol:", nuevoRol);
	console.log("[handleSave] relacionActual:", relacionActual);

	delete payload.id;
	delete payload._id;
	delete payload.displayName;
	delete payload.unit;
	delete payload.unitRole;
	delete payload.resides;
	delete payload._relacionActual;

	const result = await updateUsuario(updatedEntity.id, payload);

	if (result.tipo === "ocupante") {
  	const teniaRelacion = !!relacionActual;
  	const tieneNuevaUnidad = !!nuevaUnidad;

  	const unidadActualStr = teniaRelacion ? String(relacionActual.unidadId) : null;
const unidadNuevaStr = tieneNuevaUnidad ? String(nuevaUnidad) : null;

  const cambioUnidad =
    teniaRelacion && tieneNuevaUnidad && unidadActualStr !== unidadNuevaStr;
  const cambioSoloRol =
    teniaRelacion &&
    tieneNuevaUnidad &&
    unidadActualStr === unidadNuevaStr &&
    relacionActual.rolEnUnidad !== nuevoRol;
  const quitoUnidad = teniaRelacion && !tieneNuevaUnidad;
  const agregoUnidad = !teniaRelacion && tieneNuevaUnidad;

  	console.log("[handleSave] caso detectado:", {
    	cambioUnidad, cambioSoloRol, quitoUnidad, agregoUnidad,
  	});

  	try {
    	if (cambioUnidad || cambioSoloRol) {
      	await desvincularOcupante(relacionActual.unidadId, relacionActual.relacionId);
      	await vincularOcupante(nuevaUnidad, {
        	ocupanteId: result._id || result.id,
        	rolEnUnidad: nuevoRol,
      	});
    	} else if (quitoUnidad) {
      	await desvincularOcupante(relacionActual.unidadId, relacionActual.relacionId);
    	} else if (agregoUnidad) {
      	await vincularOcupante(nuevaUnidad, {
        	ocupanteId: result._id || result.id,
        	rolEnUnidad: nuevoRol,
      	});
    	}

    	if (cambioUnidad || cambioSoloRol || quitoUnidad || agregoUnidad) {
      	const unidadesActualizadas = await getUnidades();
      	setUnidades(unidadesActualizadas);
    	}
  	} catch (relacionErr) {
    	console.error("[handleSave] error relación:", relacionErr);
    	mostrarToastError("El usuario se guardó pero hubo un problema actualizando la unidad.");
  	}
	}

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
	 mostrarToastError(msg);
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
	const unidadId = payload.unit;
	const rolEnUnidad = payload.unitRole;
	delete payload.unit;
	delete payload.unitRole;
	delete payload.resides;
	const created = await createUsuario(payload, passwordTemporal);

	if (created.tipo === "ocupante" && unidadId && rolEnUnidad) {
  	try {
    	await vincularOcupante(unidadId, {
      	ocupanteId: created._id || created.id,
      	rolEnUnidad,
    	});
      const unidadesActualizadas = await getUnidades();
      setUnidades(unidadesActualizadas);
  	} catch (vinculacionErr) {
    	console.warn("No se pudo vincular el ocupante a la unidad:", vinculacionErr);
  	}
	}

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
	 mostrarToastError(msg);
  };
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
            <p className="py-4 text-sm text-textMuted">Cargando usuarios...</p>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <AdminUsersTable
              users={tableRows}
              totalUsers={users.length}
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
        unidadesDisponibles={unidades}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <ModalConfirmacion
        isOpen={isConfirmarDesactivacionOpen}
        title="Confirmar desactivación"
        message={
          usuarioADesactivar
          ? `¿Querés desactivar a ${usuarioADesactivar.displayName || usuarioADesactivar.nombre}?`
          : "¿Querés continuar con esta acción?"
        }
        confirmLabel="Desactivar usuario"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmarDesactivacion}
        onClose={handleCancelarDesactivacion}
        details={
          usuarioADesactivar
          ? [
              {
                label: "Usuario",
                value: usuarioADesactivar.displayName || "-",
              },
              { label: "Email", value: usuarioADesactivar.email || "-" },
              { label: "Rol", value: usuarioADesactivar.tipo || "-" },
              { label: "Estado", value: usuarioADesactivar.estado || "-" },
            ]
          : []
        }
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