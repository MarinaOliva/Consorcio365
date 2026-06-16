import { Eye } from "lucide-react";
import SectionCard from "../../../../components/dashboard/SectionCard";
import DataTable from "../../../../components/dashboard/DataTable";

function BadgeEstadoMantenimiento({ valor }) {
  const valorNormalizado = (valor ?? "").trim().toLowerCase();

  const variantes = {
    activo: "border-emerald-400 bg-emerald-50 text-emerald-600",
    inactivo: "border-slate-400 bg-slate-100 text-slate-500",
    programado: "border-violet-400 bg-violet-50 text-violet-600",
    "en curso": "border-blue-400 bg-blue-50 text-blue-600",
    completado: "border-emerald-400 bg-emerald-50 text-emerald-600",
    vencido: "border-red-400 bg-red-50 text-red-500",
  };

  if (!valor || valor === "---") {
    return <span className="text-xs font-medium text-textMuted">---</span>;
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5
        text-[10px] font-bold uppercase
        ${variantes[valorNormalizado] || "border-border bg-white text-textMuted"}
      `}
    >
      {valor}
    </span>
  );
}

function TablaPlanesMantenimiento({
  filas = [],
  onVerDetalle = () => {},
}) {
  const columnas = [
    {
      key: "tarea",
      header: "Tarea",
      render: (fila) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-textMain">{fila.tarea}</p>
        </div>
      ),
    },
    {
      key: "especialidad",
      header: "Especialidad",
    },
    {
      key: "frecuencia",
      header: "Frecuencia",
    },
    {
      key: "estadoPlan",
      header: "Estado plan",
      render: (fila) => <BadgeEstadoMantenimiento valor={fila.estadoPlan} />,
    },
    {
      key: "instanciaProgramada",
      header: "Instancia programada",
      render: (fila) => (
        <span
          className={
            fila.instanciaProgramada === "A programar"
              ? "font-medium text-textMuted"
              : "text-textMain"
          }
        >
          {fila.instanciaProgramada}
        </span>
      ),
    },
    {
      key: "estadoInstancia",
      header: "Estado instancia",
      render: (fila) => (
        <BadgeEstadoMantenimiento valor={fila.estadoInstancia} />
      ),
    },
    {
      key: "detalle",
      header: "Detalle",
      render: (fila) => (
        <button
          type="button"
          onClick={() => onVerDetalle(fila)}
          className="rounded-md p-1.5 text-textMuted transition hover:bg-primarySoft hover:text-primary"
          aria-label={`Ver detalle de ${fila.tarea}`}
          title="Ver detalle"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const total = filas.length;
  const desde = total > 0 ? 1 : 0;
  const hasta = total;

  return (
    <SectionCard title="Planes programados">
      <div className="space-y-0">
        {filas.length > 0 ? (
          <DataTable columns={columnas} rows={filas} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-textMuted">
              No se encontraron planes de mantenimiento.
            </p>
          </div>
        )}

        <div className="border-t border-border px-4 py-4 sm:px-1">
          <div className="w-full rounded-lg border border-border/70  bg-surfaceSoft/50 px-3 py-2">
            <p className="text-sm font-medium text-primary">
              Mostrando {desde}-{hasta} de {total} planes
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default TablaPlanesMantenimiento;