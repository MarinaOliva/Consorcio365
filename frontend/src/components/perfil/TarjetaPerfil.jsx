import AvatarPerfil from "./AvatarPerfil";
import ListaDatosPerfil from "./ListaDatosPerfil";
import AccionesPerfil from "./AccionesPerfil";

function TarjetaPerfil({
  perfil,
  iniciales,
  onEditarDatos,
  onCambiarContrasena,
  onSeleccionarAvatar,
}) {
  const nombreCompleto = `${perfil.nombre || ""} ${perfil.apellido || ""}`.trim();

  return (
    <div className="mx-auto w-full max-w-[800px] rounded-xl border
      border-secondary/70 bg-surfaceSoft px-6 py-6 
        shadow-[3px_5px_8px_rgba(7,40,48,0.25)] sm:px-8 sm:py-8">

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div className="flex flex-col items-center justify-center">
            <AvatarPerfil
                iniciales={iniciales}
                nombreCompleto={nombreCompleto}
                rol={perfil.rol}
                avatarUrl={perfil.avatarUrl}
                onSeleccionarAvatar={onSeleccionarAvatar}
            />
            </div>

            <div className="flex items-center">
            <ListaDatosPerfil perfil={perfil} />
            </div>
      </div>

      <AccionesPerfil
        onEditarDatos={onEditarDatos}
        onCambiarContrasena={onCambiarContrasena}
      />
    </div>
  );
}

export default TarjetaPerfil;