import { X, FileText, ImageIcon } from "lucide-react";
import Button from "../ui/Button";
import StatusBadge from "../dashboard/StatusBadge";

function ItemInfo({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase text-textMuted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-textMain">{value || "-"}</p>
    </div>
  );
}

function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

function EvidenciaCard({ evidencia, index }) {
  const esArchivoLocal = typeof evidencia === "object" && evidencia?.name;
  const url = esArchivoLocal ? null : evidencia;
  const nombre = esArchivoLocal
	? evidencia.name
	: `Evidencia ${index + 1}`;
  const esPdf = String(url || nombre).toLowerCase().endsWith(".pdf");

  if (esPdf) {
	return (
  	<button
    	type="button"
    	onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
    	disabled={!url}
    	className="
      	flex h-24 min-w-[120px] flex-col items-center justify-center rounded-lg
      	border border-red-200 bg-red-50 text-red-500
      	transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60
    	"
  	>
    	<FileText size={24} />
    	<span className="mt-1 text-xs font-black uppercase">PDF</span>
    	<span className="mt-1 max-w-[90px] truncate text-[10px] text-red-400">
      	{nombre}
    	</span>
  	</button>
	);
  }

  if (url) {
	return (
  	<button
    	type="button"
    	onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    	className="
      	relative flex h-24 min-w-[120px] flex-col overflow-hidden rounded-lg
      	border border-border/70 bg-white text-left shadow-sm transition
      	hover:shadow-md
    	"
  	>
    	<div
      	className="h-full w-full bg-cover bg-center"
      	style={{ backgroundImage: `url(${url})` }}
    	/>
    	<div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-white/75 px-2 py-1 text-[10px] font-semibold text-textMain">
      	<ImageIcon size={13} className="text-primary" />
      	<span className="truncate">{nombre}</span>
    	</div>
  	</button>
	);
  }

  // Fallback: archivo local sin URL
  return (
	<div
  	className="
    	flex h-24 min-w-[120px] items-end overflow-hidden rounded-lg
    	border border-border/70 bg-gradient-to-br
    	from-slate-100 via-slate-200 to-slate-300 p-2
  	"
	>
  	<div className="flex w-full items-center gap-1.5 rounded-md bg-white/75 px-2 py-1 text-[10px] font-semibold text-textMain">
    	<ImageIcon size={13} className="text-primary" />
    	<span className="truncate">{nombre}</span>
  	</div>
	</div>
  );
}

function ModalDetalleTrabajoProveedor({
  isOpen,
  trabajo,
  onClose,
  onMarcarEnProgreso,
  onAbrirConfirmacionFinalizacion,
  onAbrirSubirEvidencias,
}) {
  if (!isOpen || !trabajo) return null;

  const estadoActual = String(trabajo.estado || "").toLowerCase().trim();
  const mostrarAccionAsignado = estadoActual === "asignado";
  const mostrarAccionesEnProgreso = estadoActual === "en progreso";
  const evidencias = trabajo.evidencias || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto 
      px-4 py-4 sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-trabajo-title"
        className="
          relative z-10 flex w-full max-w-[760px] 
          max-h-[calc(100dvh-2rem)]
          flex-col overflow-hidden
          rounded-xl border border-secondary/70 bg-surfaceSoft
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-3 text-white">
          <h2 id="detalle-trabajo-title" className="text-lg font-bold">
            Detalles del trabajo
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="text-[24px] font-bold leading-tight text-textMain">
                {trabajo.titulo}
              </h3>

              <StatusBadge status={trabajo.estado} />
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-6">
              <ItemInfo label="ID" value={`#TRB-${String(trabajo.id).slice(-4)}`} />
              <ItemInfo label="Edificio" value={trabajo.edificio} />
              <ItemInfo label="Unidad" value={trabajo.unidad} />
              <ItemInfo label="Presupuesto" value={formatearMonto(trabajo.monto)} />
              <ItemInfo label="Fecha Inicio" value={trabajo.fechaInicio} />
              <ItemInfo label="Fecha Finalización" value={trabajo.fechaFinalizacion} />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase text-textMuted">
                Descripción
              </p>
              <p className="mt-2 text-sm leading-relaxed text-textMain">
                {trabajo.descripcion ||
                  "Reparación completa del trabajo asignado. Incluye diagnóstico, revisión de componentes afectados, ejecución de la tarea y verificación final del servicio."}
              </p>
            </div>

            {(mostrarAccionesEnProgreso || estadoActual === "finalizado") && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-primary">
                    Evidencias subidas por el proveedor
                  </h4>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                    {evidencias.length}
                  </span>
                </div>

                {evidencias.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {evidencias.map((evidencia, index) => (
                      <EvidenciaCard
                        key={`${typeof evidencia === "object" ? evidencia.name : evidencia}-${index}`}
                        evidencia={evidencia}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-textMuted">
                    Todavía no se cargaron evidencias para este trabajo.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border/70 px-6 py-5">
          <div className="flex flex-wrap justify-center gap-5">
            {mostrarAccionAsignado && (
              <Button
                variant="elevated"
                size="md"
                type="button"
                onClick={() => onMarcarEnProgreso?.(trabajo)}
              >
                Marcar como en progreso
              </Button>
            )}

            {mostrarAccionesEnProgreso && (
              <>
                <Button
                  variant="elevated"
                  size="md"
                  type="button"
                  onClick={() => onAbrirConfirmacionFinalizacion?.(trabajo)}
                >
                  Marcar como finalizado
                </Button>

                <Button
                  variant="elevated"
                  size="md"
                  type="button"
                  onClick={() => onAbrirSubirEvidencias?.(trabajo)}
                >
                  Subir evidencias
                </Button>
              </>
            )}

            <Button
              variant="neutral"
              size="md"
              type="button"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalleTrabajoProveedor;