import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "../../../../../components/ui/Card";
import Button from "../../../../../components/ui/Button";
import SuccessModal from "../../../../../components/shared/SuccessModal";
import CrearTrabajoModal from "../../../../../components/admin/CrearTrabajoModal";

function formatearMontoARS(valor = 0) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function convertirFechaArgentinaAISO(fecha = "") {
  if (!fecha) return "";
  const [dia, mes, anio] = fecha.split("/");
  if (!dia || !mes || !anio) return "";
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function formatearFechaVisibleDesdePlan(plan) {
  if (plan?.proximaInstancia?.fechaProgramada) {
    return plan.proximaInstancia.fechaProgramada;
  }

  if (plan?.proximaInstancia?.fechaSugerida) {
    return plan.proximaInstancia.fechaSugerida;
  }

  if (plan?.instanciaProgramada && plan.instanciaProgramada !== "---") {
    return plan.instanciaProgramada;
  }

  return "—";
}

function BadgeEstadoDetalle({ estado = "" }) {
  const normalizado = String(estado).trim().toLowerCase();

  const variantes = {
    activo: "border-emerald-400 bg-emerald-50 text-emerald-600",
    activa: "border-emerald-400 bg-emerald-50 text-emerald-600",
    inactivo: "border-slate-400 bg-slate-100 text-slate-600",
    cancelada: "border-red-300 bg-red-50 text-red-600",
    completada: "border-emerald-400 bg-emerald-50 text-emerald-600",
    programada: "border-violet-300 bg-violet-50 text-violet-600",
    programado: "border-violet-300 bg-violet-50 text-violet-600",
    "en curso": "border-blue-400 bg-blue-50 text-blue-600",
    "a programar": "border-slate-300 bg-slate-100 text-slate-500",
    "---": "border-slate-300 bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5
        text-[10px] font-bold uppercase
        ${variantes[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {estado}
    </span>
  );
}

function CampoInformacion({ etiqueta, valor, badge = false }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-textMuted">{etiqueta}</p>
      {badge ? (
        valor
      ) : (
        <p className="text-sm font-medium text-textMain">{valor || "—"}</p>
      )}
    </div>
  );
}

function TarjetaInformacionPlan({ plan }) {
  return (
    <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <h2 className="text-[18px] font-bold text-primary">
          Información del plan
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CampoInformacion
          etiqueta="TAREA"
          valor={plan.tareaDetalle || plan.tarea}
        />
        <CampoInformacion
          etiqueta="ESTADO"
          badge
          valor={<BadgeEstadoDetalle estado={plan.estadoPlan} />}
        />
        <CampoInformacion etiqueta="ESPECIALIDAD" valor={plan.especialidad} />
        <CampoInformacion etiqueta="FRECUENCIA" valor={plan.frecuencia} />
        
        <CampoInformacion etiqueta="EDIFICIO" valor={plan.edificio} />
        <CampoInformacion
          etiqueta="PROVEEDOR ASIGNADO"
          valor={plan.proveedorAsignado}
        />
      </div>
    </Card>
  );
}

function TarjetaUltimaInstancia({ ultimaInstancia }) {
  if (!ultimaInstancia) return null;

  return (
    <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-5 flex justify-center">
        <h2 className="text-[18px] font-bold text-primary">
          Información de última instancia
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <CampoInformacion etiqueta="PROVEEDOR" valor={ultimaInstancia.proveedor} />
        <CampoInformacion
          etiqueta="ESPECIALIDAD"
          valor={ultimaInstancia.especialidad}
        />
        <CampoInformacion
          etiqueta="MONTO"
          valor={formatearMontoARS(ultimaInstancia.monto)}
        />
        <CampoInformacion etiqueta="FECHA" valor={ultimaInstancia.fecha} />

        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-textMuted">COMPROBANTE</p>
          {ultimaInstancia.comprobanteUrl ? (
            <a
              href={ultimaInstancia.comprobanteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary hover:underline"
            >
              <FileText size={25} />
              <span className="text-sm font-medium">Ver comprobante</span>
            </a>
          ) : (
            <p className="text-sm font-medium text-textMuted">—</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function HistorialInstancias({ historial = [] }) {
  return (
    <Card className="border-secondary/70 bg-white px-5 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-4 flex justify-center">
        <h2 className="text-[18px] font-bold text-primary">
          Historial de instancias
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-xs">
          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-4 py-3 font-bold">Fecha Programada</th>
              <th className="px-4 py-3 font-bold">Monto</th>
              <th className="px-4 py-3 font-bold">Estado</th>
            </tr>
          </thead>

          <tbody>
            {historial.map((item, index) => (
              <tr
                key={`${item.fechaProgramada}-${index}`}
                className="border-b border-border/50 last:border-b-0"
              >
                <td className="px-4 py-3 text-textMain">{item.fechaProgramada}</td>
                <td className="px-4 py-3 text-textMain">
                  {formatearMontoARS(item.monto)}
                </td>
                <td className="px-4 py-3 text-textMain">
                  <BadgeEstadoDetalle estado={item.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ConfirmacionCerrarInstanciaModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-[560px] rounded-2xl border border-white/40 bg-[#cfd8dc] px-8 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-400 text-red-500">
            <CircleAlert size={30} strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="mx-auto max-w-[420px] text-[18px] font-bold leading-tight text-primary">
          Al cerrar esta instancia se generará automáticamente un gasto de tipo
          PREVENTIVO
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <Button variant="elevated" type="button" onClick={onConfirm}>
            <CircleCheck size={16} className="mr-1.5" />
            Aceptar
          </Button>

          <Button
            variant="neutral"
            type="button"
            onClick={onClose}
            className="border-red-300 text-red-500 hover:border-red-400 hover:bg-red-50"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

function CajaDatoInstancia({ icono, texto }) {
  const Icono = icono;

  return (
    <div className="mx-auto flex max-w-[380px] items-center gap-4 rounded-xl bg-slate-200/70 px-4 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-primary">
        <Icono size={25} />
      </div>
      <p className="text-sm font-semibold text-textMain">{texto}</p>
    </div>
  );
}

function obtenerFechaBase(fechaISO) {
  if (!fechaISO) return new Date();

  const [anio, mes, dia] = fechaISO.split("-").map(Number);

  if (!anio || !mes || !dia) return new Date();

  return new Date(anio, mes - 1, dia);
}

function formatearFechaISO(anio, mes, dia) {
  return `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(
    2,
    "0"
  )}`;
}

function MiniCalendario({ fechaSeleccionada, onChange }) {
  const fechaInicial = obtenerFechaBase(fechaSeleccionada);

  const [mesVisible, setMesVisible] = useState(
    new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), 1)
  );

  const diasSemana = ["L", "M", "M", "J", "V", "S", "D"];
  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  const calendario = useMemo(() => {
    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();

    const primerDiaMes = new Date(anio, mes, 1);
    const ultimoDiaMes = new Date(anio, mes + 1, 0);

    // Ajuste para que la semana empiece en lunes
    const offsetInicio = (primerDiaMes.getDay() + 6) % 7;
    const totalDias = ultimoDiaMes.getDate();

    const dias = [];

    for (let i = 0; i < offsetInicio; i += 1) {
      dias.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia += 1) {
      dias.push(dia);
    }

    return dias;
  }, [mesVisible]);

  const fechaSeleccionadaDate = fechaSeleccionada
    ? obtenerFechaBase(fechaSeleccionada)
    : null;

  const esDiaSeleccionado = (dia) => {
    if (!fechaSeleccionadaDate || !dia) return false;

    return (
      fechaSeleccionadaDate.getFullYear() === mesVisible.getFullYear() &&
      fechaSeleccionadaDate.getMonth() === mesVisible.getMonth() &&
      fechaSeleccionadaDate.getDate() === dia
    );
  };

  const irMesAnterior = () => {
    setMesVisible(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const irMesSiguiente = () => {
    setMesVisible(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const seleccionarDia = (dia) => {
    if (!dia) return;

    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();

    onChange(formatearFechaISO(anio, mes, dia));
  };

  return (
    <div className="mx-auto mt-6 max-w-[330px] rounded-2xl border-2 border-primary/50 bg-white px-5 py-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-primary">
        <button
          type="button"
          onClick={irMesAnterior}
          className="rounded-md p-1 transition hover:bg-primarySoft"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="text-base font-bold uppercase tracking-wide">
          {meses[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </p>

        <button
          type="button"
          onClick={irMesSiguiente}
          className="rounded-md p-1 transition hover:bg-primarySoft"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <input
        type="date"
        value={fechaSeleccionada}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-lg border-2 border-border bg-white
          px-3 py-2 text-sm text-textMain
          outline-none transition
          focus:border-primary focus:ring-2 focus:ring-primary/20
        "
      />

      <div className="mt-4 grid grid-cols-7 gap-2 text-center">
        {diasSemana.map((dia) => (
          <span
            key={dia}
            className="text-sm font-bold uppercase text-primary"
          >
            {dia}
          </span>
        ))}

        {calendario.map((dia, index) =>
          dia ? (
            <button
              key={`${mesVisible.getMonth()}-${dia}-${index}`}
              type="button"
              onClick={() => seleccionarDia(dia)}
              className={`
                flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition
                ${
                  esDiaSeleccionado(dia)
                    ? "bg-primary text-white shadow-sm"
                    : "text-textMain hover:bg-primarySoft hover:text-primary"
                }
              `}
            >
              {dia}
            </button>
          ) : (
            <span key={`empty-${index}`} className="h-9 w-9" />
          )
        )}
      </div>
    </div>
  );
}

function TarjetaAccionInstancia({
  plan,
  caso,
  fechaInstancia,
  setFechaInstancia,
  onVerTrabajo,
  onCerrarInstancia,
  onCrearInstancia,
  onCrearTrabajo,
}) {
  const trabajoAsociadoId =
  plan?.proximaInstancia?.trabajoAsociadoId ??
  plan?.trabajoAsociadoId ??
  null;

  const tieneTrabajoAsociado = trabajoAsociadoId !== null && trabajoAsociadoId !== undefined;

  const fechaVisible =
    caso === "activo-a-programar"
      ? plan?.proximaInstancia?.fechaSugerida ||
        formatearFechaVisibleDesdePlan(plan)
      : fechaInstancia
      ? convertirFechaArgentinaAISO(fechaInstancia)
      : plan?.proximaInstancia?.fechaProgramada ||
        formatearFechaVisibleDesdePlan(plan);

  if (caso === "activo-en-curso") {
    return (
      <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
        <div className="mb-3 flex flex-col items-center gap-3 text-center">
          <h2 className="text-[18px] font-bold text-primary">
            Próxima instancia sugerida
          </h2>
          <BadgeEstadoDetalle estado="En curso" />
        </div>

        <div className="mt-10">
          <CajaDatoInstancia
            icono={CalendarDays}
            texto={`Fecha programada: ${fechaVisible || "—"}`}
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Button variant="ghost" type="button" onClick={onVerTrabajo}>
            <Eye size={16} className="mr-1.5" />
            Ver Trabajo asociado
          </Button>

          <Button variant="elevated" type="button" onClick={onCerrarInstancia}>
            <CircleCheck size={16} className="mr-1.5" />
            Marcar como completada
          </Button>
        </div>
      </Card>
    );
  }

  if (caso === "activo-a-programar") {
    return (
      <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
        <div className="mb-3 flex justify-center text-center">
          <h2 className="text-[18px] font-bold text-primary">
            Próxima instancia sugerida
          </h2>
        </div>

        <div className="mt-6">
          <CajaDatoInstancia
            icono={CalendarDays}
            texto={`Fecha sugerida: ${fechaVisible || "—"}`}
          />
        </div>

        <MiniCalendario
          fechaSeleccionada={fechaInstancia}
          onChange={setFechaInstancia}
        />

        <div className="mt-8 flex justify-center">
          <Button
            variant="elevated"
            type="button"
            onClick={onCrearInstancia}
            disabled={!fechaInstancia}
          >
            <CircleCheck size={16} className="mr-1.5" />
            Crear Instancia
          </Button>
        </div>
      </Card>
    );
  }

  if (caso === "activo-programado" || caso === "activo-programado-alternativo") {
    return (
      <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
        <div className="mb-3 flex flex-col items-center gap-3 text-center">
          <h2 className="text-[18px] font-bold text-primary">
            Próxima instancia sugerida
          </h2>
          <BadgeEstadoDetalle estado="Programada" />
        </div>

        <div className="mt-10">
          <CajaDatoInstancia
            icono={CalendarDays}
            texto={`Fecha programada: ${fechaVisible || "—"}`}
          />
        </div>

        <div className="mt-10 flex justify-center">
          {tieneTrabajoAsociado ? (
            <Button variant="ghost" type="button" onClick={onVerTrabajo}>
              <Eye size={16} className="mr-1.5" />
              Ver Trabajo asociado
            </Button>
          ) : (
            <Button variant="ghost" type="button" onClick={onCrearTrabajo}>
              <CircleCheck size={16} className="mr-1.5" />
              Crear Trabajo
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return null;
}

function VistaDetallePlanActivo({
  plan,
  caso,
  onVolver,
}) {
  const navigate = useNavigate();

  const [modalCerrarInstanciaAbierto, setModalCerrarInstanciaAbierto] =
    useState(false);

  const [modalExitoCerrarAbierto, setModalExitoCerrarAbierto] =
    useState(false);

  const [modalCrearTrabajoAbierto, setModalCrearTrabajoAbierto] =
    useState(false);

  const [modalInstanciaCreadaAbierto, setModalInstanciaCreadaAbierto] =
    useState(false);

  const [modalTrabajoCreadoAbierto, setModalTrabajoCreadoAbierto] =
    useState(false);

  const [fechaInstancia, setFechaInstancia] = useState(
    plan?.proximaInstancia?.fechaProgramadaISO || ""
  );

  const [trabajoDraft, setTrabajoDraft] = useState({
    numeroIncidencia: "",
    origen: "Mantenimiento",
    estado: "Asignado",
    categoria: plan?.especialidad || "",
    unidad: plan?.unidad || "",
    piso: plan?.piso || "",
    edificio: plan?.edificio || "",
    titulo: plan?.tarea || "",
    descripcion: "",
    responsable: plan?.proveedorAsignado || "",
    fechaInicioEstimada: "",
    costoEstimado: "",
    prioridad: "",
    aCargoDe: "Consorcio",
  });

  const fechaVisibleActual = useMemo(() => {
    if (fechaInstancia) return convertirFechaArgentinaAISO(fechaInstancia);
    return formatearFechaVisibleDesdePlan(plan);
  }, [fechaInstancia, plan]);

  const abrirModalCerrarInstancia = () => {
    setModalCerrarInstanciaAbierto(true);
  };

  const cerrarModalCerrarInstancia = () => {
    setModalCerrarInstanciaAbierto(false);
  };

  const confirmarCerrarInstancia = () => {
    setModalCerrarInstanciaAbierto(false);
    setModalExitoCerrarAbierto(true);
  };

  const cerrarModalExitoCerrar = () => {
    setModalExitoCerrarAbierto(false);
    navigate("/admin/mantenimiento");
  };

  const handleVerTrabajoAsociado = () => {
    const trabajoId = 
    plan?.proximaInstancia?.trabajoAsociadoId??
    plan?.trabajoAsociadoId;

    if (!trabajoId) return;

    navigate(`/admin/trabajos?detalle=${trabajoId}`);
  };

  const handleCrearInstancia = () => {
    if (!fechaInstancia) return;
    setModalInstanciaCreadaAbierto(true);
  };

  const cerrarSuccessInstancia = () => {
    setModalInstanciaCreadaAbierto(false);
  };

  const handleAbrirCrearTrabajo = () => {
    const fechaProgramada =
      plan?.proximaInstancia?.fechaProgramada ||
      plan?.instanciaProgramada ||
      "";

    setTrabajoDraft((prev) => ({
      ...prev,
      origen: "Mantenimiento",
      titulo: plan?.tarea || prev.titulo,
      categoria: plan?.especialidad || prev.categoria,
      responsable: plan?.proveedorAsignado || prev.responsable,
      edificio: plan?.edificio || prev.edificio,
      fechaInicioEstimada: convertirFechaArgentinaAISO(fechaProgramada),
    }));

    setModalCrearTrabajoAbierto(true);
  };


  const handleCerrarCrearTrabajo = () => {
    setModalCrearTrabajoAbierto(false);
  };

  const handleChangeTrabajoDraft = (campo, valor) => {
    setTrabajoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCrearTrabajo = () => {
    setModalCrearTrabajoAbierto(false);
    setModalTrabajoCreadoAbierto(true);
  };

  const cerrarSuccessTrabajo = () => {
    setModalTrabajoCreadoAbierto(false);
  };

  return (
    <>
      <section className="mx-auto max-w-[1120px] space-y-5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onVolver}
          className="self-start"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver
        </Button>

        <TarjetaInformacionPlan plan={plan} />

        {plan?.ultimaInstancia ? (
          <TarjetaUltimaInstancia ultimaInstancia={plan.ultimaInstancia} />
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr]">
          <TarjetaAccionInstancia
            plan={{
              ...plan,
              proximaInstancia: {
                ...plan?.proximaInstancia,
                fechaProgramada:
                  caso === "activo-a-programar"
                    ? plan?.proximaInstancia?.fechaSugerida ||
                      plan?.proximaInstancia?.fechaProgramada ||
                      fechaVisibleActual
                    : fechaVisibleActual,
              },
            }}
            caso={caso}
            fechaInstancia={fechaInstancia}
            setFechaInstancia={setFechaInstancia}
            onVerTrabajo={handleVerTrabajoAsociado}
            onCerrarInstancia={abrirModalCerrarInstancia}
            onCrearInstancia={handleCrearInstancia}
            onCrearTrabajo={handleAbrirCrearTrabajo}
          />

          <HistorialInstancias historial={plan.historialInstancias} />
        </div>
      </section>

      <ConfirmacionCerrarInstanciaModal
        isOpen={modalCerrarInstanciaAbierto}
        onClose={cerrarModalCerrarInstancia}
        onConfirm={confirmarCerrarInstancia}
      />

      <CrearTrabajoModal
        isOpen={modalCrearTrabajoAbierto}
        onClose={handleCerrarCrearTrabajo}
        onCreate={handleCrearTrabajo}
        incidencia={null}
        values={trabajoDraft}
        onChange={handleChangeTrabajoDraft}
        modo="manual"
      />

      <SuccessModal
        isOpen={modalExitoCerrarAbierto}
        onClose={cerrarModalExitoCerrar}
        message="Instancia cerrada. Gasto creado con éxito"
      />

      <SuccessModal
        isOpen={modalInstanciaCreadaAbierto}
        onClose={cerrarSuccessInstancia}
        message="Instancia creada con éxito"
      />

      <SuccessModal
        isOpen={modalTrabajoCreadoAbierto}
        onClose={cerrarSuccessTrabajo}
        message="Trabajo creado con éxito"
      />
    </>
  );
}

export default VistaDetallePlanActivo;