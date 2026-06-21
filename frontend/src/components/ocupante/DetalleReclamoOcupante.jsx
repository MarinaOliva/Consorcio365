import { ArrowLeft, CalendarDays, MapPin, Paperclip, Wrench } from "lucide-react";
import Button from "../ui/Button";
import BadgeEstadoReclamo from "./BadgeEstadoReclamo";

function ItemInfo({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase text-textMuted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-textMain">{value || "-"}</p>
    </div>
  );
}

function BadgePrioridad({ prioridad }) {
  const normalizado = String(prioridad || "").toLowerCase().trim();

  const estilos = {
    alta: "border-red-400 bg-red-50 text-red-500",
    media: "border-yellow-400 bg-yellow-50 text-yellow-700",
    baja: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-3 py-1
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {prioridad}
    </span>
  );
}

function TarjetaSeccion({ title, children }) {
  return (
    <div
      className="
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-[3px_5px_8px_rgba(7,40,48,0.22)]
      "
    >
      <h3 className="mb-4 text-sm font-bold text-primary">{title}</h3>
      {children}
    </div>
  );
}

function DetalleReclamoOcupante({ reclamo, onVolver }) {
  if (!reclamo) return null;

  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={onVolver}
        className="gap-2"
      >
        <ArrowLeft size={16} />
        Volver
      </Button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          <TarjetaSeccion title="Información del reclamo">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-textMain">{reclamo.titulo}</h2>
              <BadgeEstadoReclamo estado={reclamo.estado} />
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
              <ItemInfo label="ID" value={`#${String(reclamo.id).slice(-4)}`} /> 
              <ItemInfo label="Fecha" value={reclamo.fecha} />
              <ItemInfo label="Categoría" value={reclamo.categoria} />
              <div>
                <p className="text-[10px] font-bold uppercase text-textMuted">
                  Prioridad
                </p>
                <div className="mt-1">
                  <BadgePrioridad prioridad={reclamo.prioridad} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-textMuted">
                <MapPin size={13} />
                Ubicación
              </p>
              <p className="mt-2 text-sm text-textMain">{reclamo.ubicacion || "-"}</p>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Descripción
              </p>
              <p className="mt-2 text-sm leading-relaxed text-textMain">
                {reclamo.descripcion || "-"}
              </p>
            </div>
          </TarjetaSeccion>

          <TarjetaSeccion title="Adjuntos">
            {reclamo.archivos?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {reclamo.archivos.map((archivo, index) => {
                const url = archivo.url || archivo;
                const label = archivo.name || `Adjunto ${index + 1}`;

                if (!url || typeof url !== "string") {
                  return (
                    <div
                      key={`adjunto-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-surfaceSoft/60 px-4 py-3"
                    >
                      <Paperclip size={16} className="text-primary" />
                      <span className="truncate text-sm font-medium text-textMain">
                        {label}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={`adjunto-${index}`}
                    type="button"
                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                    className="group block overflow-hidden rounded-lg border border-border/70 bg-white text-left shadow-sm transition hover:shadow-md"
                  >
                    <div
                      className="h-32 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Paperclip size={14} className="text-primary" />
                      <span className="truncate text-xs font-medium text-textMain group-hover:text-primary">
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            ) : (
            <p className="text-sm text-textMuted">
              No se adjuntaron pruebas en este reclamo.
            </p>
            )}
          </TarjetaSeccion>
        </div>

        <TarjetaSeccion title="Estado del seguimiento">
          <div className="space-y-4">
            <div className="rounded-lg border border-border/70 bg-surfaceSoft/60 px-4 py-4">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Estado actual
              </p>
              <div className="mt-2">
                <BadgeEstadoReclamo estado={reclamo.estado} />
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-surfaceSoft/60 px-4 py-4">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Fecha de creación
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-textMain">
                <CalendarDays size={14} />
                {reclamo.fecha}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-surfaceSoft/60 px-4 py-4">
              <p className="text-[10px] font-bold uppercase text-textMuted">
                Trabajo asociado
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-textMain">
                <Wrench size={14} className="text-primary" />
                {reclamo.trabajoAsociado || "Sin trabajo asociado"}
              </p>
            </div>
          </div>
        </TarjetaSeccion>
      </div>
    </section>
  );
}

export default DetalleReclamoOcupante;