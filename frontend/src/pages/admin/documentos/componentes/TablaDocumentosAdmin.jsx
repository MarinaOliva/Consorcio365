import { Download, FileText, Trash2 } from "lucide-react";
import BadgeTipoDocumento from "./BadgeTipoDocumento";

function BotonAccion({ onClick, label, danger = false, children }) {
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

function TablaDocumentosAdmin({
  documentos = [],
  totalDocumentos = 0,
  onEliminar,
  onDescargar,
}) {
  return (
    <div className="space-y-3">
      {/* Vista mobile */}
      <div className="space-y-3 md:hidden">
        {documentos.length > 0 ? (
          documentos.map((documento) => (
            <div
              key={documento.id}
              className="
                rounded-lg border border-border/70 bg-white p-3 shadow-sm
                transition-colors duration-150 hover:bg-primary/5
              "
            >
              <div className="border-b border-border/40 pb-2">
                <p className="mb-1 text-[10px] font-bold uppercase text-textMuted">
                  Documento
                </p>

                <div className="flex min-w-0 items-start gap-2">
                  <FileText
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                    strokeWidth={2.1}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-textMain">
                      {documento.titulo}
                    </p>
                    <p className="mt-1 text-[11px] text-textMuted">
                      #{documento.codigo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-border/40 py-2">
                <p className="mb-1 text-[10px] font-bold uppercase text-textMuted">
                  Tipo
                </p>
                <BadgeTipoDocumento tipo={documento.tipo} />
              </div>

              <div className="border-b border-border/40 py-2">
                <p className="mb-1 text-[10px] font-bold uppercase text-textMuted">
                  Fecha de creación
                </p>
                <p className="text-xs text-textMain">{documento.fechaCreacion}</p>
              </div>

              <div className="pt-2">
                <p className="mb-1 text-[10px] font-bold uppercase text-textMuted">
                  Acciones
                </p>

                <div className="flex items-center gap-2">
                  <BotonAccion
                    label="Eliminar documento"
                    danger
                    onClick={() => onEliminar?.(documento)}
                  >
                    <Trash2 size={15} />
                  </BotonAccion>

                  <BotonAccion
                    label="Descargar documento"
                    onClick={() => onDescargar?.(documento)}
                  >
                    <Download size={15} />
                  </BotonAccion>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-border/70 bg-white px-4 py-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-textMain">
              No se encontraron documentos.
            </p>
            <p className="mt-1 text-xs text-textMuted">
              Probá ajustar los filtros o subir un documento nuevo.
            </p>
          </div>
        )}
      </div>

      {/* Vista tablet / desktop */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-collapse text-xs">
          <thead>
            <tr className="bg-secondary text-left text-[11px] text-white">
              <th className="px-4 py-3 font-bold">Título</th>
              <th className="px-4 py-3 font-bold">Tipo</th>
              <th className="px-4 py-3 font-bold">Fecha Creación</th>
              <th className="px-4 py-3 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {documentos.length > 0 ? (
              documentos.map((documento) => (
                <tr
                  key={documento.id}
                  className="border-b border-border/50 last:border-b-0 transition-colors duration-150 hover:bg-primary/5"
                >
                  <td className="px-4 py-4 text-textMain">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText
                        size={18}
                        className="shrink-0 text-red-500"
                        strokeWidth={2.1}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-textMain">
                          {documento.titulo}
                        </p>
                        <p className="mt-1 text-[11px] text-textMuted">
                          #{documento.codigo}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-textMain">
                    <BadgeTipoDocumento tipo={documento.tipo} />
                  </td>

                  <td className="px-4 py-4 text-textMain">
                    <span className="font-medium">{documento.fechaCreacion}</span>
                  </td>

                  <td className="px-4 py-4 text-textMain">
                    <div className="flex items-center justify-center gap-2">
                      <BotonAccion
                        label="Eliminar documento"
                        danger
                        onClick={() => onEliminar?.(documento)}
                      >
                        <Trash2 size={15} />
                      </BotonAccion>

                      <BotonAccion
                        label="Descargar documento"
                        onClick={() => onDescargar?.(documento)}
                      >
                        <Download size={15} />
                      </BotonAccion>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-textMain">
                    No se encontraron documentos.
                  </p>
                  <p className="mt-1 text-xs text-textMuted">
                    Probá ajustar los filtros o subir un documento nuevo.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="
          rounded-lg border border-border/70 bg-surfaceSoft/50
          px-4 py-2
        "
      >
        <p className="text-xs font-medium text-primary">
          Mostrando {documentos.length} de {totalDocumentos} documentos
        </p>
      </div>
    </div>
  );
}

export default TablaDocumentosAdmin;