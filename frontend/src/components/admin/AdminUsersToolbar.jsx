import Button from "../ui/Button";
import { Plus } from "lucide-react";

function AdminUsersToolbar({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onNuevoUsuario = () => {},
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      
      {/* filtros */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full rounded-lg border border-border bg-white
            px-3 py-2 text-sm text-textMain
            outline-none transition
            placeholder:text-textMuted
            focus:border-primary focus:ring-2 focus:ring-primary/20
            sm:w-[220px]
          "
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            rounded-lg border border-border bg-white
            px-3 py-2 text-sm text-textMain
            outline-none transition
            focus:border-primary focus:ring-2 focus:ring-primary/20
          "

        >
          <option value="todos">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="ocupante">Ocupante</option>
          <option value="proveedor">Proveedor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            rounded-lg border border-border bg-white
            px-3 py-2 text-sm text-textMain
            outline-none transition
            focus:border-primary focus:ring-2 focus:ring-primary/20
          "

        >
          <option value="todos">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      <Button 
        variant="elevated"
        onClick={onNuevoUsuario}
        className="gap-2"
      >
        <Plus size={16} />
        Nuevo usuario
      </Button>
    </div>
  );
}

export default AdminUsersToolbar;