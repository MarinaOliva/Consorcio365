import Button from "../ui/Button";

function AdminUsersToolbar({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
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
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-textMain"
        >
          <option value="Todos">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Ocupante">Ocupante</option>
          <option value="Proveedor">Proveedor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-textMain"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <Button variant="elevated">
        Nuevo usuario
      </Button>
    </div>
  );
}

export default AdminUsersToolbar;