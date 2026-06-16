import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  ExternalLink,
  Eye,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCircle,
  Clock,
} from "lucide-react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";
import Button from "../../components/ui/Button";
import { trabajosAdminMock } from "../../data/trabajosAdminData";
import CrearTrabajoModal from "../../components/admin/CrearTrabajoModal";
import SuccessModal from "../../components/shared/SuccessModal";


const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

const TRABAJO_DRAFT_INICIAL = {
  // Información básica manual
  numeroIncidencia: "",
  origen: "Manual",
  estado: "Asignado",
  categoria: "",
  unidad: "",
  piso: "",
  edificio: "",

  // Datos del trabajo
  titulo: "",
  descripcion: "",
  responsable: "",
  fechaInicioEstimada: "",
  costoEstimado: "",
  prioridad: "",
  aCargoDe: "",
};

function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatearFechaInput(fechaISO) {
  if (!fechaISO) return "";

  const [anio, mes, dia] = fechaISO.split("-");

  if (!anio || !mes || !dia) return fechaISO;

  return `${dia}/${mes}/${anio}`;
}

function convertirMontoANumero(valor) {
  const limpio = String(valor ?? "")
    .replaceAll(".", "")
    .replaceAll(",", ".")
    .replace(/[^\d.]/g, "");

  const numero = Number(limpio);

  return Number.isNaN(numero) ? 0 : numero;
}



function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function convertirFechaArgentinaADate(fecha) {
  if (!fecha) return null;

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

function estaDentroDelRango(fecha, filtro) {
  if (filtro === "Todos") return true;

  const fechaTrabajo = convertirFechaArgentinaADate(fecha);

  if (!fechaTrabajo) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);
  const fechaLimite = new Date();

  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaTrabajo >= fechaLimite && fechaTrabajo <= hoy;
}

function TrabajoEstadoBadge({ estado }) {
  const normalizado = normalizarTexto(estado);

  const estilos = {
    asignado: "border-yellow-400 bg-yellow-50 text-yellow-600",
    "en progreso": "border-blue-400 bg-blue-50 text-blue-500",
    finalizado: "border-emerald-400 bg-emerald-50 text-emerald-600",
    cerrado: "border-slate-400 bg-slate-100 text-slate-500",
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

const ESTADOS_TRABAJO = ["Asignado", "En progreso", "Finalizado", "Cerrado"];

function TrabajoEstadoSelect({ value, onChange }) {
  const normalizado = normalizarTexto(value);

  const estilos = {
    asignado:
      "border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
    "en progreso": "border-blue-400 bg-blue-50 text-blue-500 hover:bg-blue-100",
    finalizado:
      "border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    cerrado: "border-slate-400 bg-slate-100 text-slate-500 hover:bg-slate-200",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
               cursor-pointer rounded-full border px-4 py-1
               text-[10px] font-bold uppercase outline-none transition-colors
               focus:ring-2 focus:ring-primary/20
               ${estilos[normalizado] || "border-border bg-white text-textMuted hover:bg-surfaceSoft"}
            `}
      >
        {ESTADOS_TRABAJO.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
      <Pencil size={20} className="shrink-0 text-primary" />
    </div>
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

function TrabajosToolbar({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
  proveedorFiltro,
  setProveedorFiltro,
  fechaFiltro,
  setFechaFiltro,
  proveedoresDisponibles,
  onNuevoTrabajo,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[140px_170px_170px_1fr]">
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className={CLASE_CAMPO_FILTRO}
        >
          <option value="Todos">Estado: Todos</option>
          <option value="Asignado">Asignado</option>
          <option value="En progreso">En progreso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <select
          value={proveedorFiltro}
          onChange={(e) => setProveedorFiltro(e.target.value)}
          className={CLASE_CAMPO_FILTRO}
        >
          <option value="Todos">Proveedor</option>
          {proveedoresDisponibles.map((proveedor) => (
            <option key={proveedor} value={proveedor}>
              {proveedor}
            </option>
          ))}
        </select>

        <div className="relative">
          <CalendarDays
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
          />

          <select
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className={`${CLASE_CAMPO_FILTRO} pl-9`}
          >
            <option value="Todos">Todas las fechas</option>
            <option value="30">Últimos 30 días</option>
            <option value="60">Últimos 60 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>

        <div className="relative">
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

      <Button
        variant="elevated"
        size="md"
        onClick={onNuevoTrabajo}
        className="w-full gap-2 lg:w-auto"
      >
        <Plus size={16} />
        Crear Trabajo
      </Button>
    </div>
  );
}

function obtenerCodigoTrabajo(trabajo) {
   const base = trabajo?.codigoTrabajo || trabajo?.id || trabajo?.numeroIncidencia || 0;

   return `TRB-${String(base).padStart(4, "0")}`;
}

function sumarDiasAFechaArgentina(fecha, dias) {
   const fechaBase = convertirFechaArgentinaADate(fecha);

   if (!fechaBase) return fecha;

   const nuevaFecha = new Date(fechaBase);
   nuevaFecha.setDate(nuevaFecha.getDate() + dias);

   return nuevaFecha.toLocaleDateString("es-AR");
}

function obtenerDetalleTrabajo(trabajo) {
   const codigoTrabajo = obtenerCodigoTrabajo(trabajo);
   const fechaInicio = trabajo.fecha;
   const fechaFinalizacion = trabajo.fechaFinalizacion || sumarDiasAFechaArgentina(fechaInicio, 1);

   return {
      codigoTrabajo,
      titulo: trabajo.incidencia || "Trabajo sin título",
      descripcion:
         trabajo.descripcion ||
         "Reparación completa del trabajo solicitado. Incluye diagnóstico, revisión de componentes afectados, ejecución de la tarea y verificación final del servicio.",
      edificio: trabajo.edificio || "Torre Norte",
      unidad: trabajo.unidad || "5B",
      presupuesto: formatearMonto(trabajo.presupuesto || 0),
      fechaInicio,
      fechaFinalizacion,
      duracion: trabajo.duracion || "2 días",
      estado: trabajo.estado,
      proveedor: trabajo.proveedor || "Sin proveedor asignado",
      incidenciaOrigen: {
         numero: trabajo.numeroIncidencia || "1238",
         titulo:
            trabajo.origen === "Mantenimiento"
               ? "Mantenimiento programado"
               : "Falta de presión de agua en edificio",
         fecha: trabajo.fecha,
      },
      historial: [
         {
            id: 1,
            tipo: "creado",
            color: "bg-red-500",
            titulo: "Trabajo creado",
            fecha: trabajo.fecha,
            hora: "10:30 hs",
            usuario: "Carlos Mendoza (Admin)",
            descripcion: `Trabajo creado desde la ${trabajo.origen?.toLowerCase() || "incidencia"} #${
               trabajo.numeroIncidencia || "-"
            }.`,
         },
         {
            id: 2,
            tipo: "asignado",
            color: "bg-yellow-500",
            titulo: "Proveedor asignado",
            fecha: trabajo.fecha,
            hora: "14:15 hs",
            usuario: "Carlos Mendoza (Admin)",
            descripcion: `Se asignó el trabajo a ${trabajo.proveedor || "un proveedor"} con presupuesto aprobado.`,
         },
         {
            id: 3,
            tipo: "iniciado",
            color: "bg-blue-500",
            titulo: "Trabajo iniciado",
            fecha: fechaInicio,
            hora: "17:00 hs",
            usuario: trabajo.proveedor || "Proveedor",
            descripcion: "El proveedor confirmó el inicio de los trabajos en el sitio.",
         },
         {
            id: 4,
            tipo: "finalizado",
            color: "bg-emerald-500",
            titulo: "Trabajo finalizado",
            fecha: fechaFinalizacion,
            hora: "13:45 hs",
            usuario: trabajo.proveedor || "Proveedor",
            descripcion:
               "El proveedor marcó el trabajo como finalizado y subió las evidencias correspondientes.",
         },
      ],
      evidencias: [
         {
            id: 1,
            tipo: "imagen",
            titulo: "Evidencia 1",
            className: "from-cyan-900 via-slate-700 to-emerald-400",
         },
         {
            id: 2,
            tipo: "imagen",
            titulo: "Evidencia 2",
            className: "from-slate-900 via-cyan-700 to-blue-300",
         },
         {
            id: 3,
            tipo: "imagen",
            titulo: "Evidencia 3",
            className: "from-yellow-300 via-slate-500 to-stone-700",
         },
         {
            id: 4,
            tipo: "pdf",
            titulo: "Informe_Tecnico.pdf",
         },
      ],
   };
}

function InfoTrabajoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[10px] font-bold uppercase text-textMuted">
        {label}
      </p>

      <p className="mt-0.5 break-words text-xs font-bold leading-snug text-slate-700">
        {value}
      </p>
    </div>
  );
}

function obtenerColorHistorialTrabajo(tipo) {
   const colores = {
      creado: "bg-red-500",
      asignado: "bg-yellow-500",
      iniciado: "bg-blue-500",
      finalizado: "bg-emerald-500",
   };

  return colores[tipo] || "bg-slate-400";
}

function HistorialItem({ item }) {
   return (
      <div className="relative flex gap-2">
         <span
            className={`
               relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full
               border-2 border-white
               ${obtenerColorHistorialTrabajo(item.tipo)}
            `}
         />

         <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
               <p className="text-sm font-bold text-textMain">{item.titulo}</p>

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
   );
}

function EvidenciaCard({ evidencia }) {
  if (evidencia.tipo === "pdf") {
    return (
      <button
        type="button"
        className="
               flex h-24 min-w-[140px] flex-col items-center justify-center rounded-lg
               border border-red-200 bg-red-50 text-red-500 transition
               hover:border-red-300 hover:bg-red-100
            "
      >
        <FileText size={24} />

        <span className="mt-1 text-xs font-black uppercase">PDF</span>

        <span className="mt-1 max-w-[110px] truncate text-[10px] text-red-300">
          {evidencia.titulo}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`
            flex h-24 min-w-[140px] items-end overflow-hidden rounded-lg
            border border-border/70 bg-gradient-to-br ${evidencia.className}
            p-2 shadow-sm transition hover:scale-[1.02]
         `}
    >
      <div className="flex w-full items-center gap-1.5 rounded-md bg-white/75 px-2 py-1 text-[10px] font-semibold text-textMain">
        <ImageIcon size={13} className="text-primary" />
        <span className="truncate">{evidencia.titulo}</span>
      </div>
    </button>
  );
}

function TarjetaDetalleTrabajo({
  title,
  children,
  className = "",
  rightContent = null,
}) 
{return (
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
)}

function TrabajoDetalleVista({ 
  trabajo, 
  onVolver,
  modoEdicion = false,
  estadoEditable,
  onEstadoChange,
  accionSuperior = null,
 }) {
  
  const detalle = obtenerDetalleTrabajo({
   ...trabajo,
   estado: modoEdicion ? estadoEditable : trabajo.estado,
  });

  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
       {accionSuperior}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <TarjetaDetalleTrabajo title="Información">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-textMain">
                {detalle.titulo}
              </h2>
              
              {modoEdicion ? (
                <TrabajoEstadoSelect
                    value={estadoEditable}
                    onChange={onEstadoChange}
                />
              ) : (
                <TrabajoEstadoBadge estado={detalle.estado} />
              )}

            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-4">
                <InfoTrabajoItem
                  label="ID"
                  value={`#${detalle.codigoTrabajo}`}
                />

                <InfoTrabajoItem label="Edificio" value={detalle.edificio} />

                <InfoTrabajoItem label="Unidad" value={detalle.unidad} />

                <InfoTrabajoItem
                  label="Presupuesto"
                  value={detalle.presupuesto}
                />
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-3">
                <InfoTrabajoItem
                  label="Fecha inicio"
                  value={detalle.fechaInicio}
                />

                <InfoTrabajoItem
                  label="Fecha finalización"
                  value={detalle.fechaFinalizacion}
                />

                <InfoTrabajoItem label="Duración" value={detalle.duracion} />
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
          </TarjetaDetalleTrabajo>

          <TarjetaDetalleTrabajo title="Incidencia de Origen">
            <div
              className="
                        rounded-lg border border-border/70
                        bg-surfaceSoft/60 px-4 py-3
                     "
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <CircleAlert size={13} />
                    </span>

                    <p className="truncate text-sm font-bold text-textMain">
                      {detalle.incidenciaOrigen.titulo}
                    </p>
                  </div>

                  <p className="mt-2 pl-7 text-xs text-textMuted">
                    <span className="font-bold text-primary">
                      #{detalle.incidenciaOrigen.numero}
                    </span>
                    <span className="mx-2">•</span>
                    Creada: {detalle.incidenciaOrigen.fecha}
                  </p>
                </div>

                <button
                  type="button"
                  className="
                  group inline-flex items-center gap-1 text-xs font-bold
                  text-primary transition-colors duration-200
                  hover:text-secondary
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30
                  focus-visible:ring-offset-2
                  "
                >
                  <span
                    className="
                    relative
                    after:absolute after:-bottom-0.5 after:left-0 after:h-[2px]
                    after:w-0 after:rounded-full after:bg-current
                    after:transition-all after:duration-200
                    group-hover:after:w-full
                    "
                  >
                    Ver incidencia
                  </span>

                  <ExternalLink
                    size={14}
                    className="
                    transition-transform duration-200
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                    "
                  />
                </button>
              </div>
            </div>
          </TarjetaDetalleTrabajo>

          <TarjetaDetalleTrabajo
            title="Evidencias subidas por el proveedor"
            rightContent={
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
                {detalle.evidencias.length}
              </span>
            }
          >
            <div className="flex flex-wrap gap-4">
              {detalle.evidencias.map((evidencia) => (
                <EvidenciaCard key={evidencia.id} evidencia={evidencia} />
              ))}
            </div>
          </TarjetaDetalleTrabajo>
        </div>

        <TarjetaDetalleTrabajo title="Historial" className="lg:min-h-[520px]">
          <div className="relative space-y-5">
            <span className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-border" />

            {detalle.historial.map((item) => (
              <HistorialItem key={item.id} item={item} />
            ))}
          </div>
        </TarjetaDetalleTrabajo>
      </div>
    </section>
  );
}

function TrabajosAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detalleTrabajoId = searchParams.get("detalle");

  const [trabajos, setTrabajos] = useState(trabajosAdminMock);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [proveedorFiltro, setProveedorFiltro] = useState("Todos");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  const [isCrearTrabajoOpen, setIsCrearTrabajoOpen] = useState(false);
  const [isTrabajoSuccessOpen, setIsTrabajoSuccessOpen] = useState(false);

  const [trabajoEnEdicion, setTrabajoEnEdicion] = useState(null);
  const [trabajoEditado, setTrabajoEditado] = useState(null);
  const [isCambiosGuardadosOpen, setIsCambiosGuardadosOpen] = useState(false);

  const [trabajoDraft, setTrabajoDraft] = useState(TRABAJO_DRAFT_INICIAL);

  const trabajoPorParametro = useMemo(() => {
    if (!detalleTrabajoId) return null;

    return (
      trabajos.find((item) => String(item.id) === String(detalleTrabajoId)) ||
      null
    );
  }, [detalleTrabajoId, trabajos]);
  
  const trabajoSeleccionado = trabajoPorParametro;

  const handleVerTrabajo = (trabajo) => {
    setTrabajoEnEdicion(null);
    setTrabajoEditado(null);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("detalle", trabajo.id);
      return next;
    });
  };

  const handleVolverListado = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("detalle");
      return next;
    });
  };

  const proveedoresDisponibles = useMemo(() => {
    return [...new Set(trabajos.map((trabajo) => trabajo.proveedor))].filter(Boolean);
  }, [trabajos]);

  const trabajosFiltrados = useMemo(() => {
    return trabajos.filter((trabajo) => {
      const coincideEstado =
        estadoFiltro === "Todos" || trabajo.estado === estadoFiltro;

      const coincideProveedor =
        proveedorFiltro === "Todos" || trabajo.proveedor === proveedorFiltro;

      const coincideFecha = estaDentroDelRango(trabajo.fecha, fechaFiltro);

      const textoBusqueda = normalizarTexto(busqueda);
      const numeroIncidencia = normalizarTexto(trabajo.numeroIncidencia);
      const numeroIncidenciaConNumeral = normalizarTexto(
        `#${trabajo.numeroIncidencia}`
      );

      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(trabajo.incidencia).includes(textoBusqueda) ||
        normalizarTexto(trabajo.origen).includes(textoBusqueda) ||
        normalizarTexto(trabajo.estado).includes(textoBusqueda) ||
        normalizarTexto(trabajo.proveedor).includes(textoBusqueda) ||
        numeroIncidencia.includes(textoBusqueda.replace("#", "")) ||
        numeroIncidenciaConNumeral.includes(textoBusqueda);

      return (
        coincideEstado &&
        coincideProveedor &&
        coincideFecha &&
        coincideBusqueda
      );
    });
  }, [trabajos, busqueda, estadoFiltro, proveedorFiltro, fechaFiltro]);


  const handleChangeEstadoTrabajo = (estado) => {
   setTrabajoEditado((prev) => ({
      ...prev,
      estado,
   }));
  };

  const handleGuardarCambiosTrabajo = () => {
   setTrabajos((prev) =>
      prev.map((trabajo) =>
         trabajo.id === trabajoEditado.id ? trabajoEditado : trabajo
      )
   );

   setTrabajoEnEdicion(trabajoEditado);
   setIsCambiosGuardadosOpen(true);
  };

  const handleChangeTrabajoDraft = (campo, valor) => {
    setTrabajoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const reiniciarTrabajoDraft = () => {
    setTrabajoDraft(TRABAJO_DRAFT_INICIAL);
  };

  const handleCerrarCrearTrabajo = () => {
    setIsCrearTrabajoOpen(false);
    reiniciarTrabajoDraft();
  };

  const handleCrearTrabajo = () => {
    const maxNumeroIncidencia = Math.max(
      0,
      ...trabajos.map((trabajo) => Number(trabajo.numeroIncidencia) || 0)
      );

    const nuevoTrabajo = {
      id: Date.now(),

      numeroIncidencia:
        trabajoDraft.numeroIncidencia || String(maxNumeroIncidencia + 1),

      incidencia: trabajoDraft.titulo || "Trabajo sin título",
      origen: trabajoDraft.origen || "Manual",
      estado: trabajoDraft.estado || "Asignado",
      proveedor: trabajoDraft.responsable || "Sin proveedor asignado",
      presupuesto: convertirMontoANumero(trabajoDraft.costoEstimado),

      fecha:
        formatearFechaInput(trabajoDraft.fechaInicioEstimada) ||
        new Date().toLocaleDateString("es-AR"),

      // Datos extra para la vista detalle futura
      descripcion: trabajoDraft.descripcion,
      prioridad: trabajoDraft.prioridad,
      aCargoDe: trabajoDraft.aCargoDe,
      categoria: trabajoDraft.categoria,
      unidad: trabajoDraft.unidad,
      piso: trabajoDraft.piso,
      edificio: trabajoDraft.edificio,
    };

    setTrabajos((prev) => [nuevoTrabajo, ...prev]);

    setIsCrearTrabajoOpen(false);
    reiniciarTrabajoDraft();
    setIsTrabajoSuccessOpen(true);
  };

  const handleNuevoTrabajo = () => {
    setIsCrearTrabajoOpen(true);
  };

  
  if (trabajoSeleccionado) {
    return (
        <ContenedorPanelPorRol
          titulo="Trabajos"
          subtitulo={`Detalle de trabajo > ID #${obtenerCodigoTrabajo(trabajoSeleccionado)}`}
        >
          <TrabajoDetalleVista
              trabajo={trabajoSeleccionado}
              onVolver={handleVolverListado}
          />
        </ContenedorPanelPorRol>
    );
  }

  if (trabajoEnEdicion && trabajoEditado) {
    return (
      <ContenedorPanelPorRol
        titulo="Trabajos"
        subtitulo={`Editar trabajo > ID #${obtenerCodigoTrabajo(trabajoEditado)}`}
      >
        <TrabajoDetalleVista
          trabajo={trabajoEditado}
          modoEdicion
          estadoEditable={trabajoEditado.estado}
          onEstadoChange={handleChangeEstadoTrabajo}
          onVolver={() => {
            setTrabajoEnEdicion(null);
            setTrabajoEditado(null);
          }}
          accionSuperior={
            <Button
              variant="elevated"
              size="sm"
              type="button"
              className="gap-2"
              onClick={handleGuardarCambiosTrabajo}
            >
              Guardar cambios
            </Button>
          }
        />

        <SuccessModal
          isOpen={isCambiosGuardadosOpen}
          onClose={() => setIsCambiosGuardadosOpen(false)}
          message="Cambios guardados con éxito"
        />
      </ContenedorPanelPorRol>
    );
  };

  const handleEditarTrabajo = (trabajo) => {
    setTrabajoEnEdicion(trabajo);
    setTrabajoEditado({ ...trabajo });
    
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("detalle");
      return next;
    });

  };


  const handleEliminarTrabajo = (trabajo) => {
    setTrabajos((prev) => prev.filter((item) => item.id !== trabajo.id));

    if (String(detalleTrabajoId) === String(trabajo.id)) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("detalle");
        return next;
      });
    }

  };

  

  return (
    <ContenedorPanelPorRol
      titulo="Trabajos"
      subtitulo="Gestión de reportes y reclamos"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <TrabajosToolbar
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
          proveedorFiltro={proveedorFiltro}
          setProveedorFiltro={setProveedorFiltro}
          fechaFiltro={fechaFiltro}
          setFechaFiltro={setFechaFiltro}
          proveedoresDisponibles={proveedoresDisponibles}
          onNuevoTrabajo={handleNuevoTrabajo}
        />

        {/* Tabla */}
        <SectionCard title="Listado de trabajos">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] table-fixed border-collapse text-xs">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[18%]" />
              </colgroup>

              <thead>
                <tr className="bg-secondary text-left text-[11px] text-white">
                  <th className="px-3 py-2 font-bold">Incidencia - Origen</th>
                  <th className="px-3 py-2 font-bold">Estado</th>
                  <th className="px-3 py-2 font-bold">Proveedor</th>
                  <th className="px-3 py-2 font-bold">Presupuesto</th>
                  <th className="px-3 py-2 font-bold">Fecha</th>
                  <th className="px-3 py-2 text-center font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {trabajosFiltrados.length > 0 ? (
                  trabajosFiltrados.map((trabajo) => (
                    <tr
                      key={trabajo.id}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <td className="px-3 py-2 text-textMain">
                        <div className="flex min-w-0 items-center gap-x-1">
                          <span className="truncate">{trabajo.incidencia}</span>
                          <span className="shrink-0 text-textMuted">-</span>
                          <span className="shrink-0 font-bold text-primary">
                            {trabajo.numeroIncidencia ? `#${trabajo.numeroIncidencia}` : trabajo.origen}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-2 text-textMain">
                        <TrabajoEstadoBadge estado={trabajo.estado} />
                      </td>

                      <td className="px-3 py-2 text-textMain">
                        <span className="block truncate">
                          {trabajo.proveedor}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-textMain">
                        <span className="font-medium">
                          {formatearMonto(trabajo.presupuesto)}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-textMain">
                        <span className="font-medium">{trabajo.fecha}</span>
                      </td>

                      <td className="px-3 py-2 text-textMain">
                        <div className="flex items-center justify-end gap-2">
                          <BotonIcono
                            label="Eliminar trabajo"
                            danger
                            onClick={() => handleEliminarTrabajo(trabajo)}
                          >
                            <Trash2 size={15} />
                          </BotonIcono>

                          <BotonIcono
                            label="Ver trabajo"
                            onClick={() => handleVerTrabajo(trabajo)}
                          >
                            <Eye size={15} />
                          </BotonIcono>

                          <BotonIcono
                            label="Editar trabajo"
                            onClick={() => handleEditarTrabajo(trabajo)}
                          >
                            <Pencil size={15} />
                          </BotonIcono>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-textMain">
                        No se encontraron trabajos.
                      </p>
                      <p className="mt-1 text-xs text-textMuted">
                        Probá ajustar los filtros o realizar una nueva búsqueda.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className="
              mt-3 rounded-lg border border-border/70 bg-surfaceSoft/50
              px-4 py-2
            "
          >
            <p className="text-xs font-medium text-primary">
              Mostrando {trabajosFiltrados.length} de {trabajos.length} trabajos
            </p>
          </div>
        </SectionCard>
      </section>
      <CrearTrabajoModal
        isOpen={isCrearTrabajoOpen}
        onClose={handleCerrarCrearTrabajo}
        onCreate={handleCrearTrabajo}
        incidencia={null}
        values={trabajoDraft}
        onChange={handleChangeTrabajoDraft}
        modo="manual"
      />

      <SuccessModal
        isOpen={isTrabajoSuccessOpen}
        onClose={() => setIsTrabajoSuccessOpen(false)}
        message="Trabajo creado con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default TrabajosAdmin;