import { Camera } from "lucide-react";
import { useRef } from "react";

function AvatarPerfil({
  iniciales,
  nombreCompleto,
  rol,
  avatarUrl,
  onSeleccionarAvatar,
}) {
  const inputFileRef = useRef(null);

  const abrirSelectorArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (event) => {
    const archivo = event.target.files?.[0];
    onSeleccionarAvatar?.(archivo);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full bg-slate-300/70 text-[38px] font-black text-secondary">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Avatar de ${nombreCompleto}`}
              className="h-full w-full object-cover"
            />
          ) : (
            iniciales
          )}
        </div>

        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={abrirSelectorArchivo}
          aria-label="Cambiar foto de perfil"
          className="
            absolute -right-10 top-[-20px]
            flex h-10 w-10 items-center justify-center rounded-full
            border-2 border-white bg-primary text-white
            shadow-[0_4px_12px_rgba(88,35,103,0.35)]
            transition hover:scale-105 hover:bg-primaryHover
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
          "
          title="Cambiar foto"
        >
          <Camera size={17} />
        </button>
      </div>

      <h2 className="mt-4 text-[34px] font-bold leading-none text-primary sm:text-[36px]">
        {nombreCompleto}
      </h2>

      <span className="mt-4 inline-flex items-center rounded-full bg-secondary px-6 py-2 text-xs font-bold text-white">
        {rol}
      </span>
    </div>
  );
}

export default AvatarPerfil;