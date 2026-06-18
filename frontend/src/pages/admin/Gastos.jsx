import { gastosData } from "../../data/gastosData";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  FileText,
  Plus,
  ReceiptText,
} from "lucide-react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import Button from "../../components/ui/Button";
import CargarGastoManualModal from "../../components/admin/CargarGastoManualModal";

const CLASE_CAMPO_FILTRO = `
  w-auto rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

const MESES_DEL_ANIO = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatearMonto(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function obtenerNombreMes(fecha) {
  if (!fecha) return "";

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return "";

  const fechaDate = new Date(anio, mes - 1, dia);

  const nombreMes = fechaDate.toLocaleDateString("es-AR", {
    month: "long",
  });

  return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
}

function obtenerPorcentaje(valor, total) {
  if (!total) return 0;

  return Math.round((valor / total) * 100);
}

function GastoTipoBadge({ tipo }) {
  const normalizado = normalizarTexto(tipo);

  const estilos = {
    reactivo: "border-secondary bg-secondary text-white",
    preventivo: "border-emerald-500 bg-emerald-500 text-white",
    manual: "border-primary bg-primary text-white",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2 py-0.5
        text-[10px] font-bold uppercase
        ${estilos[normalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {tipo}
    </span>
  );
}

function ResumenGastoCard({
  titulo,
  valor,
  descripcion,
  icon: Icon,
  iconClassName = "text-primary",
}) {
  return (
    <div
      className="
        rounded-xl border border-secondary/70 bg-white p-4
        shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold text-textMuted">{titulo}</p>

        <Icon size={22} className={iconClassName} />
      </div>

      <p className="mt-4 text-3xl font-black leading-none text-primary">
        {valor}
      </p>

      {descripcion && (
        <p className="mt-3 text-[11px] font-bold text-textMuted">
          {descripcion}
        </p>
      )}
    </div>
  );
}

function GastosAdmin() {
  const navigate = useNavigate();

  const [gastos, setGastos] = useState(gastosData);
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [isCargarGastoManualOpen, setIsCargarGastoManualOpen] = useState(false);

  const gastosFiltrados = useMemo(() => {
    return gastos.filter((gasto) => {
      const coincideTipo =
        tipoFiltro === "Todos" ||
        normalizarTexto(gasto.tipo) === normalizarTexto(tipoFiltro);

      const nombreMesGasto = obtenerNombreMes(gasto.fecha);

      const coincideMes =
        mesFiltro === "Todos" || nombreMesGasto === mesFiltro;

      return coincideTipo && coincideMes;
    });
  }, [gastos, tipoFiltro, mesFiltro]);

  const resumen = useMemo(() => {
    const total = gastosFiltrados.reduce((acc, gasto) => acc + gasto.monto, 0);

    const reactivos = gastosFiltrados
      .filter((gasto) => normalizarTexto(gasto.tipo) === "reactivo")
      .reduce((acc, gasto) => acc + gasto.monto, 0);

    const preventivos = gastosFiltrados
      .filter((gasto) => normalizarTexto(gasto.tipo) === "preventivo")
      .reduce((acc, gasto) => acc + gasto.monto, 0);

    const manuales = gastosFiltrados
      .filter((gasto) => normalizarTexto(gasto.tipo) === "manual")
      .reduce((acc, gasto) => acc + gasto.monto, 0);

    return {
      total,
      reactivos,
      preventivos,
      manuales,
      porcentajeReactivos: obtenerPorcentaje(reactivos, total),
      porcentajePreventivos: obtenerPorcentaje(preventivos, total),
      porcentajeManuales: obtenerPorcentaje(manuales, total),
    };
  }, [gastosFiltrados]);

  const handleCargarGastoManual = () => {
    setIsCargarGastoManualOpen(true);
  };

  const handleCerrarModalCargarGastoManual = () => {
    setIsCargarGastoManualOpen(false);
  };

  const handleGuardarGastoManual = (nuevoGasto) => {
    const hoy = new Date();
    const fechaActual = hoy.toLocaleDateString("es-AR");

    const nuevoRegistro = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      fecha: fechaActual,
      concepto: nuevoGasto.concepto,
      tipo: "Manual",
      proveedor: "Carga manual",
      monto: Number(nuevoGasto.monto),
      origen: "Manual",
      comprobante: nuevoGasto.comprobante,
    };

    setGastos((prev) => [nuevoRegistro, ...prev]);
    setIsCargarGastoManualOpen(false);

  };

  return (
    <ContenedorPanelPorRol
      titulo="Libro de Gastos"
      subtitulo="Gestión y seguimiento de gastos del consorcio"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>

          <Button
            variant="elevated"
            size="sm"
            type="button"
            onClick={handleCargarGastoManual}
            className="gap-2"
          >
            <Plus size={15} />
            Cargar gasto manual
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ResumenGastoCard
            titulo="Total del mes"
            valor={formatearMonto(resumen.total)}
            descripcion="↑ +12% vs mes anterior"
            icon={DollarSign}
            iconClassName="text-primary"
          />

          <ResumenGastoCard
            titulo="Gastos Reactivos"
            valor={formatearMonto(resumen.reactivos)}
            descripcion={`${resumen.porcentajeReactivos}% del total`}
            icon={AlertTriangle}
            iconClassName="text-primary"
          />

          <ResumenGastoCard
            titulo="Gastos Preventivos"
            valor={formatearMonto(resumen.preventivos)}
            descripcion={`${resumen.porcentajePreventivos}% del total`}
            icon={CalendarCheck}
            iconClassName="text-primary"
          />

          <ResumenGastoCard
            titulo="Gastos Manuales"
            valor={formatearMonto(resumen.manuales)}
            descripcion={`${resumen.porcentajeManuales}% del total`}
            icon={FileText}
            iconClassName="text-primary"
          />
        </div>

        <div className="flex flex-row flex-wrap gap-3">
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className={CLASE_CAMPO_FILTRO}
          >
            <option value="Todos">Tipo: Todos</option>
            <option value="Reactivo">Reactivo</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Manual">Manual</option>
          </select>

          <div className="relative">
            <CalendarDays
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
            />

            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className={`${CLASE_CAMPO_FILTRO} min-w-[170px] pl-9`}
            >
              <option value="Todos">Todos los meses</option>

              {MESES_DEL_ANIO.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="
            rounded-xl border border-secondary/70 bg-white p-4
            shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[999px] table-auto border-collapse text-xs">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[24%]" />
                <col className="w-[13%]" />
                <col className="w-[16%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
                <col className="w-[16%]" />
              </colgroup>

              <thead>
                <tr className="bg-secondary text-left text-[11px] text-white">
                  <th className="px-3 py-3 font-bold">Fecha</th>
                  <th className="px-3 py-3 font-bold">Concepto</th>
                  <th className="px-3 py-3 font-bold">Tipo</th>
                  <th className="px-3 py-3 font-bold">Proveedor</th>
                  <th className="px-3 py-3 font-bold">Monto</th>
                  <th className="px-3 py-3 text-center font-bold">
                    Ver comprobante
                  </th>
                  <th className="px-3 py-3 text-center font-bold">Origen</th>
                </tr>
              </thead>

              <tbody>
                {gastosFiltrados.length > 0 ? (
                  gastosFiltrados.map((gasto) => (
                    <tr
                      key={gasto.id}
                      className="
                        border-b border-border/60 last:border-b-0
                        transition hover:bg-primarySoft/20
                      "
                    >
                      <td className="px-3 py-3 font-medium text-textMain">
                        {gasto.fecha}
                      </td>

                      <td className="px-3 py-3 text-textMain">
                        <span className="block truncate font-medium">
                          {gasto.concepto}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <GastoTipoBadge tipo={gasto.tipo} />
                      </td>

                      <td className="px-3 py-3 text-textMain">
                        <span className="block truncate">
                          {gasto.proveedor}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="font-black text-primary">
                          {formatearMonto(gasto.monto)}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          aria-label={`Ver comprobante de ${gasto.concepto}`}
                          className="
                            mx-auto flex rounded-md p-1.5 text-primary
                            transition hover:bg-primarySoft hover:text-primaryDark
                          "
                        >
                          <ReceiptText size={16} />
                        </button>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="font-bold text-primary">
                          {gasto.origen}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-textMain">
                        No se encontraron gastos.
                      </p>

                      <p className="mt-1 text-xs text-textMuted">
                        Probá ajustar los filtros seleccionados.
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
              Mostrando {gastosFiltrados.length} de {gastos.length} gastos
            </p>
          </div>
        </div>
      </section>

      <CargarGastoManualModal
        isOpen={isCargarGastoManualOpen}
        onClose={handleCerrarModalCargarGastoManual}
        onSave={handleGuardarGastoManual}
      />
    </ContenedorPanelPorRol>
  );
}

export default GastosAdmin;