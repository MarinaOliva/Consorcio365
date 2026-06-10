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

const CLASE_CAMPO_FILTRO = `
  w-full rounded-lg border border-border bg-white
  px-3 py-2 text-sm text-textMain
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-primary/20
`;

const gastosAdminMock = [
  {
    id: 1,
    fecha: "15/01/2026",
    concepto: "Pérdida de agua en baño",
    tipo: "Reactivo",
    proveedor: "Plomería Rápida SRL",
    monto: 28500,
    origen: "Incidencia #1238",
    comprobante: "comprobante-1238.pdf",
  },
  {
    id: 2,
    fecha: "15/01/2026",
    concepto: "Mantenimiento ascensores",
    tipo: "Preventivo",
    proveedor: "Ascensores Rápidos SA",
    monto: 8850,
    origen: "Instancia Mant #45",
    comprobante: "comprobante-mant-45.pdf",
  },
  {
    id: 3,
    fecha: "15/01/2026",
    concepto: "Pérdida de agua en baño",
    tipo: "Reactivo",
    proveedor: "Plomería Rápida SRL",
    monto: 8500,
    origen: "Incidencia #1238",
    comprobante: "comprobante-1238-b.pdf",
  },
  {
    id: 4,
    fecha: "15/01/2026",
    concepto: "Fumigación Hall entrada",
    tipo: "Manual",
    proveedor: "Bug Busters SRL",
    monto: 12000,
    origen: "Manual",
    comprobante: "fumigacion-hall.pdf",
  },
  {
    id: 5,
    fecha: "15/01/2026",
    concepto: "Pérdida de agua en baño",
    tipo: "Reactivo",
    proveedor: "Plomería Rápida SRL",
    monto: 8500,
    origen: "Incidencia #1238",
    comprobante: "comprobante-1238-c.pdf",
  },
  {
    id: 6,
    fecha: "18/01/2026",
    concepto: "Revisión tablero eléctrico",
    tipo: "Reactivo",
    proveedor: "ElectroServicios SA",
    monto: 12900,
    origen: "Incidencia #1241",
    comprobante: "revision-tablero.pdf",
  },
  {
    id: 7,
    fecha: "20/01/2026",
    concepto: "Cambio de luminarias",
    tipo: "Reactivo",
    proveedor: "ElectroServicios SA",
    monto: 10000,
    origen: "Incidencia #1244",
    comprobante: "luminarias.pdf",
  },
  {
    id: 8,
    fecha: "21/01/2026",
    concepto: "Limpieza de tanques",
    tipo: "Preventivo",
    proveedor: "Servicios Sanitarios SA",
    monto: 12500,
    origen: "Instancia Mant #46",
    comprobante: "limpieza-tanques.pdf",
  },
  {
    id: 9,
    fecha: "22/01/2026",
    concepto: "Control matafuegos",
    tipo: "Preventivo",
    proveedor: "Seguridad Integral SRL",
    monto: 15530,
    origen: "Instancia Mant #47",
    comprobante: "matafuegos.pdf",
  },
  {
    id: 10,
    fecha: "24/01/2026",
    concepto: "Jardinería espacios comunes",
    tipo: "Manual",
    proveedor: "Verde Urbano",
    monto: 13000,
    origen: "Manual",
    comprobante: "jardineria.pdf",
  },
  {
    id: 11,
    fecha: "25/01/2026",
    concepto: "Service portón eléctrico",
    tipo: "Preventivo",
    proveedor: "Portones Norte",
    monto: 15500,
    origen: "Instancia Mant #48",
    comprobante: "porton-electrico.pdf",
  },
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

function obtenerMesAnio(fecha) {
  if (!fecha) return "";

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return "";

  const fechaDate = new Date(anio, mes - 1, dia);

  return fechaDate.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
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
    manual: "border-slate-500 bg-slate-500 text-white",
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

  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [mesFiltro, setMesFiltro] = useState("Enero 2026");

  const mesesDisponibles = useMemo(() => {
    const meses = gastosAdminMock
      .map((gasto) => obtenerMesAnio(gasto.fecha))
      .filter(Boolean)
      .map((mes) => mes.charAt(0).toUpperCase() + mes.slice(1));

    return [...new Set(meses)];
  }, []);

  const gastosFiltrados = useMemo(() => {
    return gastosAdminMock.filter((gasto) => {
      const coincideTipo = tipoFiltro === "Todos" || gasto.tipo === tipoFiltro;

      const mesGasto = obtenerMesAnio(gasto.fecha);
      const mesGastoCapitalizado =
        mesGasto.charAt(0).toUpperCase() + mesGasto.slice(1);

      const coincideMes =
        mesFiltro === "Todos" || mesGastoCapitalizado === mesFiltro;

      return coincideTipo && coincideMes;
    });
  }, [tipoFiltro, mesFiltro]);

  const resumen = useMemo(() => {
    const total = gastosFiltrados.reduce((acc, gasto) => acc + gasto.monto, 0);

    const reactivos = gastosFiltrados
      .filter((gasto) => gasto.tipo === "Reactivo")
      .reduce((acc, gasto) => acc + gasto.monto, 0);

    const preventivos = gastosFiltrados
      .filter((gasto) => gasto.tipo === "Preventivo")
      .reduce((acc, gasto) => acc + gasto.monto, 0);

    const manuales = gastosFiltrados
      .filter((gasto) => gasto.tipo === "Manual")
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
    console.log("Cargar gasto manual");
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
            Cargar Gasto Manual
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
            iconClassName="text-secondary"
          />

          <ResumenGastoCard
            titulo="Gastos Preventivos"
            valor={formatearMonto(resumen.preventivos)}
            descripcion={`${resumen.porcentajePreventivos}% del total`}
            icon={CalendarCheck}
            iconClassName="text-emerald-500"
          />

          <ResumenGastoCard
            titulo="Gastos Manuales"
            valor={formatearMonto(resumen.manuales)}
            descripcion={`${resumen.porcentajeManuales}% del total`}
            icon={FileText}
            iconClassName="text-slate-500"
          />
        </div>

        <div
          className="
            inline-flex flex-col gap-3 rounded-xl border border-secondary/70
             bg-white p-2 shadow-[3px_5px_8px_rgba(7,40,48,0.18)]
            sm:flex-row
          "
        >
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

              {mesesDisponibles.map((mes) => (
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
            <table className="w-full min-w-[850px] table-fixed border-collapse text-xs">
              <colgroup>
                <col className="w-[11%]" />
                <col className="w-[24%]" />
                <col className="w-[14%]" />
                <col className="w-[20%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
                <col className="w-[5%]" />
              </colgroup>

              <thead>
                <tr className="bg-secondary text-left text-[11px] text-white">
                  <th className="px-3 py-3 font-bold">Fecha</th>
                  <th className="px-3 py-3 font-bold">Concepto</th>
                  <th className="px-3 py-3 font-bold">Tipo</th>
                  <th className="px-3 py-3 font-bold">Proveedor</th>
                  <th className="px-3 py-3 font-bold">Monto</th>
                  <th className="px-3 py-3 font-bold">Origen</th>
                  <th className="px-3 py-3 text-center font-bold">
                    Ver comprobante
                  </th>
                </tr>
              </thead>

              <tbody>
                {gastosFiltrados.length > 0 ? (
                  gastosFiltrados.map((gasto) => (
                    <tr
                      key={gasto.id}
                      className="
                        border-b border-border/60 last:border-b-0
                        transition hover:bg-primarySoft/40
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

                      <td className="px-3 py-3">
                        <span className="font-bold text-primary">
                          {gasto.origen}
                        </span>
                      </td>

                      <td className="px-3 py-3">
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
              Mostrando {gastosFiltrados.length} de {gastosAdminMock.length}{" "}
              gastos
            </p>
          </div>
        </div>
      </section>
    </ContenedorPanelPorRol>
  );
}

export default GastosAdmin;