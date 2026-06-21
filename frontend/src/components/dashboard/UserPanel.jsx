function obtenerInicialesUsuario(nombre = "") {
  const texto = String(nombre || "").trim();

  if (!texto) return "U";

  const partes = texto.split(" ").filter(Boolean);

  if (partes.length >= 2) {
    return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return "U";
}

function UserPanel({ user }) {
  const iniciales = obtenerInicialesUsuario(user?.name);

  return (
    <div className="bg-primary/50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-emerald-300 bg-surfaceSoft text-primary shadow-sm">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`Avatar de ${user?.name || "usuario"}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-black leading-none">
              {iniciales}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">
            {user?.name}
          </p>

          <p className="text-[10px] text-white/60">
            {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;