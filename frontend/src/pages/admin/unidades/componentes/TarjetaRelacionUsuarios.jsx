import { Pencil, UserCircle } from "lucide-react";

import BadgeEstado from "./BadgeEstado";
import CampoEditable from "./CampoEditable";
import SelectEditable from "./SelectEditable";
import TarjetaDetalle from "./TarjetaDetalle";

function TarjetaRelacionUsuarios({
  usuarios = [],
  editable = false,
  onActualizarRelacionUsuario = () => {},
  onFinalizarRelacionUsuario = () => {},
}) {
  return (
    <TarjetaDetalle title="Relación con usuarios" titleAlign="center">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="
              rounded-lg border border-border/70
              bg-surfaceSoft/60 p-4
            "
          >
            {editable ? (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary">
                    <UserCircle size={26} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-textMain">
                        {usuario.nombre}
                      </p>

                      {usuario.estadoRelacion === "Finalizada" && (
                        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          Finalizada
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-[11px] font-semibold text-textMuted">
                      Relación editable
                    </p>
                  </div>

                  <div className="text-primary">
                    <Pencil size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <SelectEditable
                    label="Rol"
                    value={usuario.rol}
                    onChange={(valor) =>
                      onActualizarRelacionUsuario(usuario.id, "rol", valor)
                    }
                    options={["Propietario", "Inquilino"]}
                  />

                  <CampoEditable
                    label="Desde"
                    type="text"
                    value={usuario.desde}
                    onChange={(valor) =>
                      onActualizarRelacionUsuario(usuario.id, "desde", valor)
                    }
                  />

                  <CampoEditable
                    label="Hasta"
                    type="text"
                    value={usuario.hasta}
                    onChange={(valor) =>
                      onActualizarRelacionUsuario(usuario.id, "hasta", valor)
                    }
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => onFinalizarRelacionUsuario(usuario.id)}
                    className="
                      inline-flex items-center justify-center
                      whitespace-nowrap
                      rounded-full border border-red-300 bg-red-50
                      px-6 py-2
                      text-xs font-bold text-red-600 transition
                      hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-100
                      shadow-lg
                    "
                  >
                    Finalizar relación
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <UserCircle className="text-secondary" size={29} />

                  <p className="truncate text-sm font-semibold text-textMain">
                    {usuario.nombre}
                  </p>

                  <BadgeEstado estado={usuario.rol} />
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-textMuted">Desde:</span>{" "}
                    <span className="font-bold text-textMain">
                      {usuario.desde}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-textMuted">Hasta:</span>{" "}
                    <span className="font-bold text-textMain">
                      {usuario.hasta}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </TarjetaDetalle>
  );
}

export default TarjetaRelacionUsuarios;