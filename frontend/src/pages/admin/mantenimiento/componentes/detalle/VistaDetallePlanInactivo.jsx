import { ArrowLeft, FileText, CircleCheck } from "lucide-react";
import Button from "../../../../../components/ui/Button";
import Card from "../../../../../components/ui/Card";

function formatearMonto(valor) {
  if (typeof valor !== "number") return valor || "---";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function BadgeEstadoDetalle({ valor }) {
  const valorNormalizado = (valor ?? "").trim().toLowerCase();

  const variantes = {
    inactivo: "border-slate-400 bg-slate-100 text-slate-600",
    cancelada: "border-red-300 bg-red-50 text-red-600",
    completada: "border-emerald-400 bg-emerald-50 text-emerald-600",
    activo: "border-emerald-400 bg-emerald-50 text-emerald-600",
    activa: "border-emerald-400 bg-emerald-50 text-emerald-600",
    programado: "border-blue-300 bg-blue-50 text-blue-600",
    "en curso": "border-blue-400 bg-blue-50 text-blue-600",
  };

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

function CampoInformacion({ etiqueta, valor, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-textMuted">{etiqueta}</p>

      {children ? (
        <div>{children}</div>
      ) : (
        <p className="text-sm font-medium leading-snug text-textMain">{valor || "---"}</p>
      )}
    </div>
  );
}

function TarjetaInformacionPlan({ plan }) {
  return (
    <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        <h2 className="text-[18px] font-bold text-primary">
          Información del plan
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CampoInformacion etiqueta="Tarea" valor={plan.tareaDetalle || plan.tarea} />
        <CampoInformacion etiqueta="Estado">
          <BadgeEstadoDetalle valor={plan.estadoPlan} />
        </CampoInformacion>
        <CampoInformacion etiqueta="Especialidad" valor={plan.especialidad} />
        <CampoInformacion etiqueta="Frecuencia" valor={plan.frecuencia} />
        <CampoInformacion etiqueta="Edificio" valor={plan.edificio} />
        <CampoInformacion
          etiqueta="Proveedor Asignado"
          valor={plan.proveedorAsignado}
        />
      </div>
    </Card>
  );
}

function TarjetaUltimaInstancia({ ultimaInstancia }) {
  return (
    <Card className="border-secondary/70 bg-white px-6 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-5 text-center">
        <h2 className="text-[18px] font-bold text-primary">
          Información de última instancia
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <CampoInformacion
          etiqueta="Proveedor"
          valor={ultimaInstancia?.proveedor}
        />
        <CampoInformacion
          etiqueta="Especialidad"
          valor={ultimaInstancia?.especialidad}
        />
        <CampoInformacion
          etiqueta="Monto"
          valor={formatearMonto(ultimaInstancia?.monto)}
        />
        <CampoInformacion
          etiqueta="Fecha"
          valor={ultimaInstancia?.fecha}
        />

        <CampoInformacion etiqueta="Comprobante">
          {ultimaInstancia?.comprobanteUrl ? (
            <a
              href={ultimaInstancia.comprobanteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary transition hover:text-secondary hover:underline"
            >
              <FileText size={25} />
              <span className="text-sm font-medium">Ver comprobante</span>
            </a>
          ) : (
            <span className="text-sm font-medium text-textMuted">---</span>
          )}
        </CampoInformacion>
      </div>
    </Card>
  );
}

function HistorialInstancias({ historial = [] }) {
  return (
    <Card className="mx-auto max-w-[520px] border-red/70 bg-white px-5 py-5 shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
      <div className="mb-4 text-center">
        <h2 className="text-[18px] font-bold text-primary">
          Historial de instancias
        </h2>
      </div>

      <div>
        <table className="w-full table-fixed border-collapse text-xs">
          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-3 py-3 font-bold">Fecha Programada</th>
              <th className="px-3 py-3 font-bold">Monto</th>
              <th className="px-3 py-3 font-bold">Estado</th>
            </tr>
          </thead>

          <tbody>
            {historial.map((item, index) => (
              <tr
                key={`${item.fechaProgramada}-${index}`}
                className="border-b border-border/50 last:border-b-0"
              >
                <td className="px-3 py-3 font-medium text-textMain">
                  {item.fechaProgramada}
                </td>
                <td className="px-3 py-3 font-medium text-textMain">
                  {formatearMonto(item.monto)}
                </td>
                <td className="px-3 py-3 font-medium text-textMain">
                  <BadgeEstadoDetalle valor={item.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function VistaDetallePlanInactivo({
  plan,
  onVolver,
  onActivarPlan,
}) {
  return (
    <section className="mx-auto max-w-[1120px] space-y-5">
      <Button
        variant="ghost"
        type="button"
        onClick={onVolver}
      >
        <ArrowLeft size={18} />
        <span>Volver</span>
      </Button>

      <TarjetaInformacionPlan plan={plan} />

      <TarjetaUltimaInstancia ultimaInstancia={plan.ultimaInstancia} />

      <HistorialInstancias historial={plan.historialInstancias} />

      <div className="flex justify-center pt-1">
        <Button variant="elevated" type="button" onClick={onActivarPlan}>
          <CircleCheck size={16} className="mr-1.5" />
          Activar plan
        </Button>
      </div>
    </section>
  );
}

export default VistaDetallePlanInactivo;