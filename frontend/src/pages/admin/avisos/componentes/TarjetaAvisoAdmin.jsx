import { Building2, CalendarDays, Pencil, Trash2 } from "lucide-react";
import Button from "../../../../components/ui/Button";

function TarjetaAvisoAdmin({ aviso, onEditar, onEliminar, mostrarAcciones = true }) {
  return (
    <div
      className="
        rounded-xl border border-secondary/70 bg-white p-6
        shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
      "
    >
      <div className="space-y-4">
        <h2 className="text-center text-[18px] font-bold text-primary">
          {aviso.titulo}
        </h2>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-textMuted">
          <div className="flex items-center gap-2">
            <Building2 size={14} />
            <span>{aviso.edificioId?.nombre || "Edificio"}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={14} />
            <span>
              Publicado:{" "}
              {aviso.fechaPublicacion
                ? new Date(aviso.fechaPublicacion).toLocaleDateString("es-AR")
                : ""}
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-textMain">
          {aviso.cuerpo}
        </p>

        {mostrarAcciones && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onEditar?.(aviso)}
              className="gap-2 bg-primary/50"
            >
              <Pencil size={14} />
              Editar
            </Button>

            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={() => onEliminar?.(aviso)}
              className="gap-2"
            >
              <Trash2 size={14} />
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TarjetaAvisoAdmin;