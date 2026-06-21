import BadgeEstadoIncidencia from "./BadgeEstadoIncidencia";
import BadgePrioridad from "./BadgePrioridad";
import InfoIncidenciaItem from "./InfoIncidenciaItem";
import TarjetaDetalleIncidencia from "./TarjetaDetalleIncidencia";

function BloqueInformacionIncidencia({
  incidencia,
  editable = false,
  onActualizarCampo = () => {},
}) {
  return (
    <TarjetaDetalleIncidencia title="Información">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-textMain">{incidencia.titulo}</h2>

        {editable ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-textMuted">
                Estado
              </label>

              <select
                value={incidencia.estado}
                onChange={(e) => onActualizarCampo("estado", e.target.value)}
                className="
                  w-full min-w-[135px] rounded-lg border border-border bg-white
                  px-3 py-2 text-xs font-bold text-textMain
                  outline-none transition
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                "
              >
                <option value="ABIERTA">Abierta</option>
                <option value="EN_PROGRESO">En progreso</option>
                <option value="RESUELTA">Resuelta</option>
                <option value="CERRADA">Cerrada</option>
                <option value="RECHAZADA">Rechazada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-textMuted">
                Prioridad
              </label>

              <select
                value={incidencia.prioridad}
                onChange={(e) => onActualizarCampo("prioridad", e.target.value)}
                className="
                  w-full min-w-[135px] rounded-lg border border-border bg-white
                  px-3 py-2 text-xs font-bold text-textMain
                  outline-none transition
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                "
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        ) : (
          <BadgeEstadoIncidencia estado={incidencia.estado} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:grid-cols-[0.7fr_1fr_0.7fr_1.2fr_1.4fr_0.9fr]">
        <InfoIncidenciaItem label="ID" value={`#${String(incidencia.id).slice(-4)}`} /> 
        <InfoIncidenciaItem label="Edificio" value={incidencia.edificio} />
        <InfoIncidenciaItem label="Unidad" value={incidencia.unidad} />
        <InfoIncidenciaItem label="Creado por" value={incidencia.creadoPor} />
        <InfoIncidenciaItem
          label="Fecha creación"
          value={incidencia.fechaCreacionCompleta}
        />

        <div>
          <p className="text-[10px] font-bold uppercase text-textMuted">
            {editable ? "Prioridad actual" : "Prioridad"}
          </p>

          <div className="mt-1">
            <BadgePrioridad prioridad={incidencia.prioridad} />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase text-textMuted">
          Descripción
        </p>

        <p className="mt-2 text-sm leading-relaxed text-textMain">
          {incidencia.descripcion}
        </p>
      </div>
    </TarjetaDetalleIncidencia>
  );
}

export default BloqueInformacionIncidencia;