import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Eye, Plus, Wrench, X } from "lucide-react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import Button from "../../components/ui/Button";
import SuccessModal from "../../components/shared/SuccessModal";
import ModalNuevoReclamo from "../../components/ocupante/ModalNuevoReclamo";
import BadgeEstadoReclamo from "../../components/ocupante/BadgeEstadoReclamo";
import DetalleReclamoOcupante from "../../components/ocupante/DetalleReclamoOcupante";

import { miUnidadMock, reclamosMock } from "../../data/ocupanteDashboardData";

const RECLAMO_INICIAL = {
  titulo: "",
  descripcion: "",
  ubicacion: "",
  categoria: "",
  prioridad: "",
  archivos: [],
};

function formatearFechaActual() {
  return new Date().toLocaleDateString("es-AR");
}

function obtenerTrabajoAsociadoPorEstado(estado) {
  const valor = String(estado || "").toLowerCase().trim();

  if (valor === "en trabajo") return "Trabajo asignado";
  if (valor === "resuelta" || valor === "cerrada") return "Trabajo finalizado";
  return "Sin trabajo asociado";
}

function obtenerClaseBorde(estado) {
  const valor = String(estado || "").toLowerCase().trim();

  if (valor === "abierta") return "border-l-red-400";
  if (valor === "en trabajo") return "border-l-blue-400";
  if (valor === "resuelta") return "border-l-emerald-400";
  if (valor === "cerrada") return "border-l-slate-400";

  return "border-l-slate-300";
}

function mapearPrioridadAEstado(prioridad) {
  const valor = String(prioridad || "").toLowerCase();
  if (valor === "alta") return "Abierta";
  if (valor === "media") return "Abierta";
  return "Abierta";
}

function ReclamosOcupante() {
  const navigate = useNavigate();

  const [reclamos, setReclamos] = useState(
    reclamosMock.map((reclamo) => ({
      ...reclamo,
      trabajoAsociado: obtenerTrabajoAsociadoPorEstado(reclamo.estado),
      categoria: reclamo.categoria || "General",
      prioridad: reclamo.prioridad || "Media",
      ubicacion: reclamo.ubicacion || `${miUnidadMock.numero} - ${miUnidadMock.piso}`,
      descripcion:
        reclamo.descripcion ||
        "Reclamo generado por el ocupante. Pendiente de seguimiento.",
      archivos: reclamo.archivos || [],
    }))
  );

  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState(null);

  const [isNuevoReclamoOpen, setIsNuevoReclamoOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [formReclamo, setFormReclamo] = useState(RECLAMO_INICIAL);

  const subtitulo = reclamoSeleccionado
    ? `Detalle de reclamo > ID #${reclamoSeleccionado.id}`
    : `${miUnidadMock.torre} - Unidad ${miUnidadMock.numero}`;

  const unidadActual = useMemo(() => {
    return {
      ...miUnidadMock,
      ocupante: "María Lozana",
      edificio: miUnidadMock.torre,
    };
  }, []);

  const reclamosFiltrados = useMemo(() => {
    if (estadoFiltro === "Todos") return reclamos;

    return reclamos.filter((reclamo) => reclamo.estado === estadoFiltro);
  }, [reclamos, estadoFiltro]);

  const handleAbrirNuevoReclamo = () => {
    setFormReclamo(RECLAMO_INICIAL);
    setIsNuevoReclamoOpen(true);
  };

  const handleCerrarNuevoReclamo = () => {
    setIsNuevoReclamoOpen(false);
  };

  const handleChangeReclamo = (campo, valor) => {
    setFormReclamo((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCrearReclamo = () => {
    const nuevoReclamo = {
      id: Date.now(),
      titulo: formReclamo.titulo,
      fecha: formatearFechaActual(),
      estado: mapearPrioridadAEstado(formReclamo.prioridad),
      descripcion: formReclamo.descripcion,
      ubicacion: formReclamo.ubicacion,
      categoria: formReclamo.categoria,
      prioridad: formReclamo.prioridad,
      archivos: formReclamo.archivos,
      trabajoAsociado: "Sin trabajo asociado",
    };

    setReclamos((prev) => [nuevoReclamo, ...prev]);
    setIsNuevoReclamoOpen(false);
    setIsSuccessOpen(true);
    setFormReclamo(RECLAMO_INICIAL);
  };

  if (reclamoSeleccionado) {
    return (
      <ContenedorPanelPorRol
        titulo="Mis Reclamos"
        subtitulo={subtitulo}
      >
        <DetalleReclamoOcupante
          reclamo={reclamoSeleccionado}
          onVolver={() => setReclamoSeleccionado(null)}
        />

        <ModalNuevoReclamo
          isOpen={isNuevoReclamoOpen}
          onClose={handleCerrarNuevoReclamo}
          onCreate={handleCrearReclamo}
          form={formReclamo}
          onChange={handleChangeReclamo}
          unidadActual={unidadActual}
        />

        <SuccessModal
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          message="Su reclamo ha sido creado con éxito"
        />
      </ContenedorPanelPorRol>
    );
  }

  return (
    <ContenedorPanelPorRol
      titulo="Mis Reclamos"
      subtitulo={subtitulo}
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="elevated"
            size="sm"
            type="button"
            onClick={handleAbrirNuevoReclamo}
            className="gap-2"
          >
            <Plus size={15} />
            Nuevo Reclamo
          </Button>
        </div>

        <div
          className="
            rounded-xl border border-secondary/70 bg-white p-5
            shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
          "
        >
          <div className="mb-5">
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="
                rounded-lg border border-border bg-white
                px-4 py-2 text-sm text-textMain
                outline-none transition
                focus:border-primary focus:ring-2 focus:ring-primary/20
              "
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Abierta">Abierta</option>
              <option value="En trabajo">En trabajo</option>
              <option value="Resuelta">Resuelta</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          </div>

          <div className="space-y-4">
            {reclamosFiltrados.length > 0 ? (
              reclamosFiltrados.map((reclamo) => (
                <div
                  key={reclamo.id}
                  className={`
                    rounded-xl border border-border/80 border-l-4
                    bg-surfaceSoft/55 px-5 py-5
                    ${obtenerClaseBorde(reclamo.estado)}
                  `}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="truncate text-[17px] font-medium text-textMain">
                          {reclamo.titulo}
                        </p>

                        <BadgeEstadoReclamo estado={reclamo.estado} />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-textMuted">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={14} />
                          {reclamo.fecha}
                        </p>

                        <p className="flex items-center gap-2">
                          {reclamo.trabajoAsociado === "Sin trabajo asociado" ? (
                            <X size={14} />
                          ) : (
                            <Wrench size={14} className="text-primary" />
                          )}
                          <span
                            className={
                              reclamo.trabajoAsociado === "Sin trabajo asociado"
                                ? "text-textMuted"
                                : "font-medium text-primary"
                            }
                          >
                            {reclamo.trabajoAsociado}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReclamoSeleccionado(reclamo)}
                      className="
                        rounded-md p-2 text-primary transition
                        hover:bg-primarySoft hover:text-primaryHover
                      "
                      aria-label={`Ver detalle del reclamo ${reclamo.id}`}
                    >
                      <Eye size={19} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-textMain">
                  No se encontraron reclamos.
                </p>
                <p className="mt-1 text-xs text-textMuted">
                  Probá cambiar el filtro o crear un nuevo reclamo.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ModalNuevoReclamo
        isOpen={isNuevoReclamoOpen}
        onClose={handleCerrarNuevoReclamo}
        onCreate={handleCrearReclamo}
        form={formReclamo}
        onChange={handleChangeReclamo}
        unidadActual={unidadActual}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message="Su reclamo ha sido creado con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default ReclamosOcupante;