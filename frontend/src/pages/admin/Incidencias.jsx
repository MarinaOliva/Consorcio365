import { useMemo, useState } from "react";
import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";
import { incidenciasAdminMock } from "../../data/incidenciasAdminData";
import Button from "../../components/ui/Button";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Eye,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCircle,
  Wrench,
} from "lucide-react";
import CrearTrabajoModal from "../../components/admin/CrearTrabajoModal";
import SuccessModal from "../../components/shared/SuccessModal";


const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function EstadoIncidenciaBadge({ estado }) {
  const normalizado = estado?.toLowerCase();

  const estilos = {
    abierta: "border-red-400 bg-red-50 text-red-500",
    asignado: "border-orange-400 bg-orange-50 text-orange-500",
    "en trabajo": "border-blue-400 bg-blue-50 text-blue-500",
    resuelta: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrada: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

function BotonIcono({ children, onClick, label, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        rounded-md p-1.5 transition
        ${
          danger
            ? "text-textMuted hover:bg-red-100 hover:text-red-500"
            : "text-textMuted hover:bg-primarySoft hover:text-primary"
        }
      `}
    >
      {children}
    </button>
  );
}

function TarjetaDetalleIncidencia({
  title,
  children,
  className = "",
  rightContent = null,
}) {
  return (
    <div
      className={`
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-[3px_5px_8px_rgba(7,40,48,0.22)]
        ${className}
      `}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        {rightContent}
      </div>

      {children}
    </div>
  );
}

function InfoIncidenciaItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[10px] font-bold uppercase text-textMuted">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold leading-snug text-textMain">{value}</p>
    </div>
  );
}

function PrioridadBadge({ prioridad }) {
  const normalizado = prioridad?.toLowerCase();

  const estilos = {
    alta: "border-red-400 bg-red-50 text-red-500",
    media: "border-yellow-400 bg-yellow-50 text-yellow-600",
    baja: "border-slate-400 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {prioridad}
    </span>
  );
}

function TrabajoEstadoBadge({ estado }) {
  const normalizado = estado?.toLowerCase();

  const estilos = {
    asignado: "border-blue-400 bg-blue-50 text-blue-500",
    programado: "border-primary/40 bg-primary/10 text-primary",
    finalizado: "border-emerald-400 bg-emerald-50 text-emerald-600",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

function EvidenciaPreview({ label, index }) {
  const fondos = [
    "from-cyan-50 via-slate-100 to-teal-100",
    "from-slate-100 via-gray-100 to-stone-200",
    "from-orange-50 via-amber-100 to-stone-200",
  ];

  return (
    <div
      className={`
        flex h-24 min-w-[140px] items-end overflow-hidden rounded-lg
        border border-border/70 bg-gradient-to-br
        ${fondos[index % fondos.length]}
      `}
    >
      <div className="flex w-full items-center gap-2 bg-white/75 px-3 py-2 text-[11px] font-bold text-textMain backdrop-blur-sm">
        <ImageIcon size={13} className="text-primary" />
        <span className="truncate">{label}</span>
      </div>
    </div>
  );
}

function obtenerDetalleIncidencia(incidencia) {
  return {
    ...incidencia,
    fechaCreacionCompleta:
      incidencia.fechaCreacionCompleta || `${incidencia.fechaCreacion} 10:30`,
    prioridad: incidencia.prioridad || "Alta",
    descripcion:
      incidencia.descripcion ||
      "Se detectó una pérdida de agua constante en el baño principal. El agua gotea de forma continua y la situación genera desperdicio de agua y molestias durante la noche.",
    trabajosAsociados:
      incidencia.trabajosAsociados || [
        {
          id: 1,
          titulo: "Reparación de canilla - Baño principal",
          proveedor: "Plomería Rápida SRL",
          fechaProgramada: "18/01/2024",
          estado: "Asignado",
        },
      ],
    evidencias:
      incidencia.evidencias || [
        "Baño principal",
        "Grifería",
        "Mueble bajo mesada",
      ],
    historial:
      incidencia.historial || [
        {
          id: 1,
          tipo: "creada",
          titulo: "Incidencia creada",
          fecha: incidencia.fechaCreacion,
          hora: "10:30 hs",
          usuario: incidencia.creadoPor,
          descripcion:
            "Se reportó la incidencia desde la unidad indicada.",
        },
        {
          id: 2,
          tipo: "estado",
          titulo: "Estado actualizado",
          fecha: "15/01/2026",
          hora: "14:15 hs",
          usuario: "Administrador",
          descripcion: `La incidencia pasó al estado Asignado. Se asignó el proveedor Plomería Rápida SRL para su resolución.`,
        },
        {
          id: 3,
          tipo: "trabajo",
          titulo: "Trabajo asociado",
          fecha: "16/01/2026",
          hora: "09:00 hs",
          usuario: "Plomería Rápida SRL",
          descripcion:
            "Se programó una visita para revisar y resolver la incidencia.",
        },
        {
          id: 4,
          tipo: "comentario",
          titulo: "Comentario agregado",
          fecha: "16/01/2026",
          hora: "16:45 hs",
          usuario: incidencia.creadoPor,
          descripcion:
            "La situación continúa, la pérdida empeoró durante la noche. Se solicita resolver con prioridad.",
        },
      ],
  };
}

function obtenerColorHistorial(tipo) {
  const colores = {
    creada: "bg-red-500",
    estado: "bg-blue-500",
    trabajo: "bg-blue-500",
    comentario: "bg-red-500",
  };

  return colores[tipo] || "bg-slate-400";
}

function convertirFechaArgentinaADate(fecha) {
  if (!fecha) return null;

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

function estaDentroDelRango(fechaCreacion, filtro) {
  if (filtro === "Todos") return true;

  const fechaIncidencia = convertirFechaArgentinaADate(fechaCreacion);

  if (!fechaIncidencia) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);

  const fechaLimite = new Date();
  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaIncidencia >= fechaLimite && fechaIncidencia <= hoy;
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .trim();
}

function clonarObjeto(objeto) {
  return typeof structuredClone === "function"
    ? structuredClone(objeto)
    : JSON.parse(JSON.stringify(objeto));
}

function IncidenciasAdmin() {
  const [edificioFiltro, setEdificioFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [unidadFiltro, setUnidadFiltro] = useState("Todas");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);
  const [incidenciaEnEdicion, setIncidenciaEnEdicion] = useState(null);
  const [incidenciaOriginalEdicion, setIncidenciaOriginalEdicion] = useState(null);

  const [isCrearTrabajoOpen, setIsCrearTrabajoOpen] = useState(false);
  const [isTrabajoSuccessOpen, setIsTrabajoSuccessOpen] = useState(false);

  const [trabajoDraft, setTrabajoDraft] = useState({
    titulo: "",
    descripcion: "",
    responsable: "",
    fechaInicioEstimada: "",
    costoEstimado: "",
    prioridad: "",
    aCargoDe: "",
  });

  const edificiosDisponibles = useMemo(() => {
    return ["Todos", ...new Set(incidenciasAdminMock.map((i) => i.edificio))];
  }, []);

  const unidadesDisponibles = useMemo(() => {
    return ["Todas", ...new Set(incidenciasAdminMock.map((i) => i.unidad))];
  }, []);

  const incidenciasFiltradas = useMemo(() => {
    return incidenciasAdminMock.filter((incidencia) => {
      const coincideEdificio =
        edificioFiltro === "Todos" || incidencia.edificio === edificioFiltro;

      const coincideEstado =
        estadoFiltro === "Todos" || incidencia.estado === estadoFiltro;

      const coincideUnidad =
        unidadFiltro === "Todas" || incidencia.unidad === unidadFiltro;
      
      const coincideFecha = estaDentroDelRango(
        incidencia.fechaCreacion,
        fechaFiltro
      );
  
      const textoBusqueda = busqueda.toLowerCase();
      const textoBusquedaSinNumeral = textoBusqueda.replace("#", "");
      const idNormalizado = normalizarTexto(incidencia.id);

      const coincideBusqueda =
        textoBusqueda === "" ||
        idNormalizado.includes(textoBusquedaSinNumeral) ||
        normalizarTexto(`#${incidencia.id}`).includes(textoBusqueda) ||
        normalizarTexto(incidencia.titulo).includes(textoBusqueda) ||
        normalizarTexto(incidencia.creadoPor).includes(textoBusqueda) ||
        normalizarTexto(incidencia.categoria).includes(textoBusqueda) ||
        normalizarTexto(incidencia.unidad).includes(textoBusqueda) ||
        normalizarTexto(incidencia.edificio).includes(textoBusqueda) ||
        normalizarTexto(incidencia.estado).includes(textoBusqueda) ||
        String(incidencia.id).includes(textoBusqueda);
      
      return (
        coincideEdificio &&
        coincideEstado &&
        coincideUnidad &&
        coincideFecha &&
        coincideBusqueda
      );
    });
  }, [edificioFiltro, estadoFiltro, unidadFiltro, fechaFiltro, busqueda]);

  const abrirEdicionIncidencia = (incidencia) => {
    const detalle = obtenerDetalleIncidencia(incidencia);

    setIncidenciaEnEdicion(clonarObjeto(detalle));
    setIncidenciaOriginalEdicion(clonarObjeto(detalle));
    setIncidenciaSeleccionada(null);
  };

  const actualizarCampoIncidencia = (campo, valor) => {
    setIncidenciaEnEdicion((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const hayCambiosPendientesIncidencia = () => {
    if (!incidenciaEnEdicion || !incidenciaOriginalEdicion) return false;

    return (
      incidenciaEnEdicion.estado !== incidenciaOriginalEdicion.estado ||
      incidenciaEnEdicion.prioridad !== incidenciaOriginalEdicion.prioridad
    );
  };

  const volverDesdeEdicionIncidencia = () => {
    if (hayCambiosPendientesIncidencia()) {
      const confirmarSalida = window.confirm(
        "Hay cambios sin guardar. ¿Deseás salir de todos modos?",
      );

      if (!confirmarSalida) return;
    }

    setIncidenciaEnEdicion(null);
    setIncidenciaOriginalEdicion(null);
  };

  const guardarCambiosIncidencia = () => {
    console.log("Incidencia editada:", incidenciaEnEdicion);

    setIncidenciaSeleccionada(incidenciaEnEdicion);
    setIncidenciaEnEdicion(null);
    setIncidenciaOriginalEdicion(null);
  };

const abrirModalCrearTrabajo = () => {
    setTrabajoDraft({
      titulo: "",
      descripcion: "",
      responsable: "",
      fechaInicioEstimada: "",
      costoEstimado: "",
      prioridad: "",
      aCargoDe: "",
    });

    setIsCrearTrabajoOpen(true);
  };

  const cerrarModalCrearTrabajo = () => {
    setIsCrearTrabajoOpen(false);
  };

  const actualizarTrabajoDraft = (campo, valor) => {
    setTrabajoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const confirmarCrearTrabajo = () => {
    const nuevoTrabajo = {
      id: Date.now(),
      titulo: trabajoDraft.titulo || "Nuevo trabajo",
      proveedor: trabajoDraft.responsable || "Responsable pendiente",
      fechaProgramada: trabajoDraft.fechaInicioEstimada || "Sin fecha",
      estado: "Asignado",
      descripcion: trabajoDraft.descripcion,
      costoEstimado: trabajoDraft.costoEstimado,
      prioridad: trabajoDraft.prioridad,
      aCargoDe: trabajoDraft.aCargoDe,
    };

    if (incidenciaSeleccionada) {
      setIncidenciaSeleccionada((prev) => ({
        ...prev,
        estado: prev.estado === "Abierta" ? "Asignado" : prev.estado,
        trabajosAsociados: [...(prev.trabajosAsociados || []), nuevoTrabajo],
      }));
    }

    if (incidenciaEnEdicion) {
      setIncidenciaEnEdicion((prev) => ({
        ...prev,
        estado: prev.estado === "Abierta" ? "Asignado" : prev.estado,
        trabajosAsociados: [...(prev.trabajosAsociados || []), nuevoTrabajo],
      }));
    }

    setIsCrearTrabajoOpen(false);
    setIsTrabajoSuccessOpen(true);
  };

  if (incidenciaEnEdicion) {
    const detalle = incidenciaEnEdicion;

    return (
      <ContenedorPanelPorRol
        titulo="Incidencias"
        subtitulo={`Editar incidencia > ID #${detalle.id}`}
      >
        <section className="mx-auto max-w-[1120px] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={volverDesdeEdicionIncidencia}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Volver
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="elevated"
                size="sm"
                type="button"
                onClick={guardarCambiosIncidencia}
                className="gap-2"
              >
                Guardar cambios
              </Button>

              <Button
                variant="elevated"
                size="sm"
                type="button"
                className="gap-2"
                onClick={abrirModalCrearTrabajo}
              >
                <Plus size={15} />
                Crear Trabajo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-5">
              <TarjetaDetalleIncidencia title="Información">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-textMain">
                    {detalle.titulo}
                  </h2>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-textMuted">
                        Estado
                      </label>

                      <select
                        value={detalle.estado}
                        onChange={(e) =>
                          actualizarCampoIncidencia("estado", e.target.value)
                        }
                        className="
                        w-full min-w-[135px] rounded-lg border border-border bg-white
                        px-3 py-2 text-xs font-bold text-textMain
                        outline-none transition
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                      "
                      >
                        <option value="Abierta">Abierta</option>
                        <option value="Asignado">Asignado</option>
                        <option value="En trabajo">En trabajo</option>
                        <option value="Resuelta">Resuelta</option>
                        <option value="Cerrada">Cerrada</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-textMuted">
                        Prioridad
                      </label>

                      <select
                        value={detalle.prioridad}
                        onChange={(e) =>
                          actualizarCampoIncidencia("prioridad", e.target.value)
                        }
                        className="
                        w-full min-w-[135px] rounded-lg border border-border bg-white
                        px-3 py-2 text-xs font-bold text-textMain
                        outline-none transition
                        focus:border-primary focus:ring-2 focus:ring-primary/20
                      "
                      >
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-[0.7fr_1fr_0.7fr_1.2fr_1.4fr_0.9fr]">
                  <InfoIncidenciaItem label="ID" value={`#${detalle.id}`} />

                  <InfoIncidenciaItem
                    label="Edificio"
                    value={detalle.edificio}
                  />

                  <InfoIncidenciaItem label="Unidad" value={detalle.unidad} />

                  <InfoIncidenciaItem
                    label="Creado por"
                    value={detalle.creadoPor}
                  />

                  <InfoIncidenciaItem
                    label="Fecha creación"
                    value={detalle.fechaCreacionCompleta}
                  />

                  <div>
                    <p className="whitespace-nowrap text-[10px] font-bold uppercase text-textMuted">
                      Prioridad actual
                    </p>

                    <div className="mt-1">
                      <PrioridadBadge prioridad={detalle.prioridad} />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase text-textMuted">
                    Descripción
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-textMain">
                    {detalle.descripcion}
                  </p>
                </div>
              </TarjetaDetalleIncidencia>

              <TarjetaDetalleIncidencia
                title="Trabajos Asociados"
                rightContent={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                    {detalle.trabajosAsociados.length}
                  </span>
                }
              >
                <div className="space-y-3">
                  {detalle.trabajosAsociados.map((trabajo) => (
                    <div
                      key={trabajo.id}
                      className="
                      rounded-lg border border-border/70
                      bg-surfaceSoft/60 px-4 py-3
                    "
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Wrench
                              size={15}
                              className="shrink-0 text-primary"
                            />

                            <p className="truncate text-sm font-bold text-textMain">
                              {trabajo.titulo}
                            </p>
                          </div>

                          <div className="mt-2 space-y-1 pl-6 text-xs text-textMuted">
                            <p className="flex items-center gap-1.5">
                              <UserCircle size={12} />
                              {trabajo.proveedor}
                            </p>

                            <p className="flex items-center gap-1.5">
                              <CalendarDays size={12} />
                              Programado: {trabajo.fechaProgramada}
                            </p>
                          </div>
                        </div>

                        <TrabajoEstadoBadge estado={trabajo.estado} />
                      </div>
                    </div>
                  ))}
                </div>
              </TarjetaDetalleIncidencia>

              <TarjetaDetalleIncidencia
                title="Evidencias"
                rightContent={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                    {detalle.evidencias.length}
                  </span>
                }
              >
                <div className="flex flex-wrap gap-4">
                  {detalle.evidencias.map((evidencia, index) => (
                    <EvidenciaPreview
                      key={`${evidencia}-${index}`}
                      label={evidencia}
                      index={index}
                    />
                  ))}
                </div>
              </TarjetaDetalleIncidencia>
            </div>

            <TarjetaDetalleIncidencia
              title="Historial"
              className="lg:min-h-[520px]"
            >
              <div className="relative space-y-5">
                <span className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-border" />

                {detalle.historial.map((item) => (
                  <div key={item.id} className="relative flex gap-3">
                    <span
                      className={`
                      relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full
                      border-2 border-white
                      ${obtenerColorHistorial(item.tipo)}
                    `}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold text-textMain">
                          {item.titulo}
                        </p>

                        <span className="shrink-0 text-[11px] font-semibold text-textMuted">
                          {item.fecha}
                        </span>
                      </div>

                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                        <Clock size={12} />
                        {item.hora}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                        <UserCircle size={12} />
                        {item.usuario}
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-textMain">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TarjetaDetalleIncidencia>
          </div>
        </section>

        <CrearTrabajoModal
          isOpen={isCrearTrabajoOpen}
          onClose={cerrarModalCrearTrabajo}
          onCreate={confirmarCrearTrabajo}
          values={trabajoDraft}
          onChange={actualizarTrabajoDraft}
          incidencia={detalle}
        />

        <SuccessModal
          isOpen={isTrabajoSuccessOpen}
          onClose={() => setIsTrabajoSuccessOpen(false)}
          message="Trabajo creado con éxito"
        />

      </ContenedorPanelPorRol>
    );
  }

  if (incidenciaSeleccionada) {
    const detalle = obtenerDetalleIncidencia(incidenciaSeleccionada);
    
    return (
      <ContenedorPanelPorRol
        titulo="Incidencias"
        subtitulo={`Detalle de incidencia > ID #${detalle.id}`}
      >
        <section className="mx-auto max-w-[1120px] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIncidenciaSeleccionada(null)}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Volver
            </Button>

            <Button
              variant="elevated"
              size="sm"
              type="button"
              className="gap-2"
              onClick={abrirModalCrearTrabajo}
            >
              <Plus size={15} />
              Crear Trabajo
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-5">
              <TarjetaDetalleIncidencia title="Información">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-textMain">
                    {detalle.titulo}
                  </h2>

                  <EstadoIncidenciaBadge estado={detalle.estado} />
                </div>

                <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-[0.7fr_1fr_0.7fr_1.2fr_1.4fr_0.9fr]">
                  <InfoIncidenciaItem
                    label="ID"
                    value={`#${detalle.id}`}
                  />

                  <InfoIncidenciaItem
                    label="Edificio"
                    value={detalle.edificio}
                  />

                  <InfoIncidenciaItem
                    label="Unidad"
                    value={detalle.unidad}
                  />

                  <InfoIncidenciaItem
                    label="Creado por"
                    value={detalle.creadoPor}
                  />

                  <InfoIncidenciaItem
                    label="Fecha creación"
                    value={detalle.fechaCreacionCompleta}
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase text-textMuted">
                      Prioridad
                    </p>

                    <div className="mt-1">
                      <PrioridadBadge prioridad={detalle.prioridad} />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase text-textMuted">
                    Descripción
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-textMain">
                    {detalle.descripcion}
                  </p>
                </div>
              </TarjetaDetalleIncidencia>

              <TarjetaDetalleIncidencia
                title="Trabajos Asociados"
                rightContent={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                    {detalle.trabajosAsociados.length}
                  </span>
                }
              >
                <div className="space-y-3">
                  {detalle.trabajosAsociados.map((trabajo) => (
                    <div
                      key={trabajo.id}
                      className="
                        rounded-lg border border-border/70
                        bg-surfaceSoft/60 px-4 py-3
                      "
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Wrench size={15} className="shrink-0 text-primary" />

                            <p className="truncate text-sm font-bold text-textMain">
                              {trabajo.titulo}
                            </p>
                          </div>

                          <div className="mt-2 space-y-1 pl-6 text-xs text-textMuted">
                            <p className="flex items-center gap-1.5">
                              <UserCircle size={12} />
                              {trabajo.proveedor}
                            </p>

                            <p className="flex items-center gap-1.5">
                              <CalendarDays size={12} />
                              Programado: {trabajo.fechaProgramada}
                            </p>
                          </div>
                        </div>

                        <TrabajoEstadoBadge estado={trabajo.estado} />
                      </div>
                    </div>
                  ))}
                </div>
              </TarjetaDetalleIncidencia>

              <TarjetaDetalleIncidencia
                title="Evidencias"
                rightContent={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                    {detalle.evidencias.length}
                  </span>
                }
              >
                <div className="flex flex-wrap gap-4">
                  {detalle.evidencias.map((evidencia, index) => (
                    <EvidenciaPreview
                      key={`${evidencia}-${index}`}
                      label={evidencia}
                      index={index}
                    />
                  ))}
                </div>
              </TarjetaDetalleIncidencia>
            </div>

            <TarjetaDetalleIncidencia title="Historial" className="lg:min-h-[520px]">
              <div className="relative space-y-5">
                <span className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-border" />

                {detalle.historial.map((item) => (
                  <div key={item.id} className="relative flex gap-3">
                    <span
                      className={`
                        relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full
                        border-2 border-white
                        ${obtenerColorHistorial(item.tipo)}
                      `}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold text-textMain">
                          {item.titulo}
                        </p>

                        <span className="shrink-0 text-[11px] font-semibold text-textMuted">
                          {item.fecha}
                        </span>
                      </div>

                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                        <Clock size={12} />
                        {item.hora}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-textMuted">
                        <UserCircle size={12} />
                        {item.usuario}
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-textMain">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TarjetaDetalleIncidencia>
          </div>
        </section>
        
        <CrearTrabajoModal
          isOpen={isCrearTrabajoOpen}
          onClose={cerrarModalCrearTrabajo}
          onCreate={confirmarCrearTrabajo}
          values={trabajoDraft}
          onChange={actualizarTrabajoDraft}
          incidencia={detalle}
        />

        <SuccessModal
          isOpen={isTrabajoSuccessOpen}
          onClose={() => setIsTrabajoSuccessOpen(false)}
          message="Trabajo creado con éxito"
        />

      </ContenedorPanelPorRol>
    );
  }
      
  return (
    <ContenedorPanelPorRol
      titulo="Incidencias"
      subtitulo="Gestión de reportes y reclamos"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        {/* Filtros */}
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <select
              value={edificioFiltro}
              onChange={(e) => setEdificioFiltro(e.target.value)}
              className={`${CLASE_CAMPO_FILTRO} sm:w-[180px]`}
            >
              {edificiosDisponibles.map((edificio) => (
                <option key={edificio} value={edificio}>
                  Edificio: {edificio}
                </option>
              ))}
            </select>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className={`${CLASE_CAMPO_FILTRO} sm:w-[140px]`}
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Abierta">Estado: Abierta</option>
              <option value="En trabajo">Estado: En trabajo</option>
              <option value="Resuelta">Estado: Resuelta</option>
              <option value="Cerrada">Estado: Cerrada</option>
            </select>

            <select
              value={unidadFiltro}
              onChange={(e) => setUnidadFiltro(e.target.value)}
              className={`${CLASE_CAMPO_FILTRO} sm:w-[140px]`}
            >
              {unidadesDisponibles.map((unidad) => (
                <option key={unidad} value={unidad}>
                  Unidad: {unidad}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-[180px]">
              <select
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className={`${CLASE_CAMPO_FILTRO} pl-9`}
              >
                <option value="Todos">Todas las fechas</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="365">Último año</option>
              </select>

              <CalendarDays
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              />
            </div>

            <div className="relative w-full sm:w-[165px]">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              />

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className={`${CLASE_CAMPO_FILTRO} pl-9`}
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <SectionCard title="Lista de incidencias">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-fixed border-collapse text-xs">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[15%]" />
                <col className="w-[11%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
              </colgroup>

              <thead>
                <tr className="bg-secondary text-left text-[11px] text-white">
                  <th className="px-2 py-2 font-bold">ID</th>
                  <th className="px-2 py-2 font-bold">Título</th>
                  <th className="px-2 py-2 font-bold">Edificio</th>
                  <th className="px-2 py-2 font-bold">Unidad</th>
                  <th className="px-2 py-2 font-bold">Creado por</th>
                  <th className="px-2 py-2 font-bold">Categoría</th>
                  <th className="px-2 py-2 font-bold">Estado</th>
                  <th className="px-2 py-2 font-bold">Fecha creación</th>
                  <th className="px-2 py-2 text-center font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {incidenciasFiltradas.map((incidencia) => (
                  <tr
                    key={incidencia.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-primarySoft/30"
                  >
                    <td className="px-2 py-3 font-bold text-textMuted">
                      #{incidencia.id}
                    </td>

                    <td className="px-2 py-3 text-textMain">
                      <div className="truncate font-semibold">
                        {incidencia.titulo}
                      </div>
                    </td>

                    <td className="px-1 py-3 text-textMain">
                      {incidencia.edificio}
                    </td>

                    <td className="px-1 py-3 text-textMain truncate">
                      {incidencia.unidad}
                    </td>

                    <td className="px-2 py-3 text-textMain">
                      <div className="truncate">
                        {incidencia.creadoPor}
                      </div>
                    </td>

                    <td className="px-2 py-3 text-textMain">
                      <div className="truncate">
                        {incidencia.categoria}
                      </div>
                    </td>

                    <td className="px-1 py-3 inline-flex items-center justify-center">
                      <EstadoIncidenciaBadge estado={incidencia.estado} />
                    </td>

                    <td className="px-0.5 py-3 text-textMain truncate">
                      {incidencia.fechaCreacion}
                    </td>

                    <td className="px-1 py-3">
                      <div className="flex min-w-[76px] items-center justify-center gap-0.5">
                        <BotonIcono
                          label={`Eliminar incidencia ${incidencia.id}`}
                          danger
                        >
                          <Trash2 size={15} />
                        </BotonIcono>

                        <BotonIcono
                          onClick={() => setIncidenciaSeleccionada(incidencia)}
                          label={`Ver incidencia ${incidencia.id}`}
                        >
                          <Eye size={15} />
                        </BotonIcono>

                        <BotonIcono
                          onClick={() => abrirEdicionIncidencia(incidencia)}
                          label={`Editar incidencia ${incidencia.id}`}
                        >
                          <Pencil size={15} />
                        </BotonIcono>
                      </div>
                    </td>
                  </tr>
                ))}

                {incidenciasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-sm text-textMuted"
                    >
                      No se encontraron incidencias con esos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg border border-border/70 bg-surfaceSoft/50 px-4 py-3 text-xs font-semibold text-primary">
            Mostrando {incidenciasFiltradas.length} de{" "}
            {incidenciasAdminMock.length} incidencias
          </div>
        </SectionCard>
      </section>
    </ContenedorPanelPorRol>
  );
}

export default IncidenciasAdmin;