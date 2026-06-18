import EvidenciaPreview from "./EvidenciaPreview";
import TarjetaDetalleIncidencia from "./TarjetaDetalleIncidencia";

function BloqueEvidencias({ evidencias = [] }) {
  return (
    <TarjetaDetalleIncidencia
      title="Evidencias"
      rightContent={
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-600">
          {evidencias.length}
        </span>
      }
    >
      <div className="flex flex-wrap gap-4">
        {evidencias.map((evidencia, index) => (
          <EvidenciaPreview
            key={`${evidencia}-${index}`}
            label={evidencia}
            index={index}
          />
        ))}
      </div>
    </TarjetaDetalleIncidencia>
  );
}

export default BloqueEvidencias;