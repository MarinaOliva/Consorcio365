import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Button from "../../../../components/ui/Button";

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
    <div className="mx-auto mt-3 max-w-[320px] rounded-2xl border-[1.5px] border-primary/40 bg-white px-5 py-4 shadow-sm">
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

      <div className="grid grid-cols-7 gap-2 text-center">
        {diasSemana.map((dia) => (
          <span key={dia} className="text-sm font-bold uppercase text-primary">
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

const CLASE_CAMPO_MODAL = `
  w-full rounded-xl border border-secondary bg-white
  px-4 py-3 text-sm font-semibold text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

function ModalEditarAviso({
  isOpen,
  onClose,
  onSave,
  valores,
  onChangeCampo,
  modo = "editar",
}) {
  if (!isOpen) return null;

  const tituloModal = modo === "crear" ? "Nuevo Aviso" : "Editar Aviso";
  const labelBoton = modo === "crear" ? "Guardar aviso" : "Guardar cambios";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-aviso-title"
        className="
          relative z-10 flex w-full max-w-[620px] max-h-[90dvh] flex-col overflow-hidden
          rounded-2xl border border-white/40 bg-[#cfd8dc]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2 id="editar-aviso-title" className="text-base font-bold">
            {tituloModal}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1 transition hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
          <input
            type="text"
            value={valores.edificio}
            onChange={(e) => onChangeCampo("edificio", e.target.value)}
            className={CLASE_CAMPO_MODAL}
            placeholder="Edificio"
          />

          <input
            type="text"
            value={valores.titulo}
            onChange={(e) => onChangeCampo("titulo", e.target.value)}
            className={CLASE_CAMPO_MODAL}
            placeholder="Título"
          />

          <textarea
            value={valores.descripcion}
            onChange={(e) => onChangeCampo("descripcion", e.target.value)}
            rows={5}
            className={`
              ${CLASE_CAMPO_MODAL}
              resize-none leading-relaxed
            `}
            placeholder="Descripción del aviso"
          />

          <div className="space-y-3">
            <p className="text-center text-base font-bold text-textMain">
              Seleccione la fecha
            </p>

            <MiniCalendario
              fechaSeleccionada={valores.fechaPublicacion}
              onChange={(valor) => onChangeCampo("fechaPublicacion", valor)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 border-t border-border px-6 py-5">
          <Button
            variant="elevated"
            type="button"
            onClick={onSave}
            className="gap-2"
          >
            <CheckCircle2 size={16} />
            {labelBoton}
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

export default ModalEditarAviso;