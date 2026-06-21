import { ArrowLeft, Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";

import BloqueEvidencias from "./BloqueEvidencias";
import BloqueInformacionIncidencia from "./BloqueInformacionIncidencia";
import BloqueTrabajosAsociados from "./BloqueTrabajosAsociados";
import HistorialIncidencia from "./HistorialIncidencia";

function VistaDetalleIncidencia({ incidencia, onVolver, onCrearTrabajo }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onVolver}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>

        <Button
          variant="elevated"
          size="sm"
          type="button"
          className="gap-2"
          onClick={onCrearTrabajo}
        >
          <Plus size={15} />
          Crear Trabajo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-5">
          <BloqueInformacionIncidencia incidencia={incidencia} />
          <BloqueTrabajosAsociados trabajos={incidencia.trabajosAsociados} />
          <BloqueEvidencias evidencias={incidencia.evidencias} />
        </div>

        <HistorialIncidencia historial={incidencia.historial} />
      </div>
    </>
  );
}

export default VistaDetalleIncidencia;