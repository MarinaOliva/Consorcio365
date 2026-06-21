function ItemDatoPerfil({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-medium text-textMuted">{label}</p>
      <p className="text-[18px] leading-snug text-textMain sm:text-[20px]">
        {value || "-"}
      </p>
    </div>
  );
}

function ListaDatosPerfil({ perfil }) {
  return (
    <div className="grid grid-cols-1 gap-y-4">
      <ItemDatoPerfil label="Nombre" value={perfil.nombre} />
      <ItemDatoPerfil label="Apellido" value={perfil.apellido} />
      <ItemDatoPerfil label="Email" value={perfil.email} />
      <ItemDatoPerfil label="Teléfono" value={perfil.telefono} />
    </div>
  );
}

export default ListaDatosPerfil;