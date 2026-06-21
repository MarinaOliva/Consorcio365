import EspecialidadBanner from "./EspecialidadBanner";
import ProveedorStatsGrid from "./ProveedorStatsGrid";
import TrabajosActivosList from "./TrabajosActivosList";
import ModalDetalleTrabajoProveedor from "./ModalDetalleTrabajoProveedor";
import ModalConfirmarFinalizacionTrabajo from "./ModalConfirmarFinalizacionTrabajo";
import ModalSubirEvidenciasTrabajo from "./ModalSubirEvidenciasTrabajo";
import SuccessModal from "../shared/SuccessModal";

import { useTrabajosProveedor } from "../../hooks/useTrabajosProveedor";

function PanelGeneralProveedor() {
  const {
	trabajosActivos,
	estadisticas,
	especialidad,
	loading,
	error,

	trabajoSeleccionado,
	trabajoEnFinalizacion,
	trabajoEnCargaEvidencia,

	isSuccessOpen,
	successMessage,

	handleVerDetalleTrabajo,
	handleCerrarDetalleTrabajo,
	handleMarcarEnProgreso,
	handleAbrirConfirmacionFinalizacion,
	handleCerrarConfirmacionFinalizacion,
	handleConfirmarFinalizacionTrabajo,
	handleAbrirSubirEvidencias,
	handleCerrarSubirEvidencias,
	handleSubirEvidencias,
	cerrarSuccess,
  } = useTrabajosProveedor();

  return (
	<>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<EspecialidadBanner especialidad={especialidad} />

    	{loading && (
      	<p className="py-6 text-sm text-textMuted">Cargando trabajos...</p>
    	)}

    	{error && !loading && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-4">
        	<p className="text-sm font-semibold text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
      	<>
        	<ProveedorStatsGrid stats={estadisticas} />

        	<TrabajosActivosList
          	trabajos={trabajosActivos}
          	onVerDetalle={handleVerDetalleTrabajo}
        	/>
      	</>
    	)}
  	</section>

  	<ModalDetalleTrabajoProveedor
    	isOpen={Boolean(trabajoSeleccionado)}
    	trabajo={trabajoSeleccionado}
    	onClose={handleCerrarDetalleTrabajo}
    	onMarcarEnProgreso={handleMarcarEnProgreso}
    	onAbrirConfirmacionFinalizacion={handleAbrirConfirmacionFinalizacion}
    	onAbrirSubirEvidencias={handleAbrirSubirEvidencias}
  	/>

  	<ModalConfirmarFinalizacionTrabajo
    	isOpen={Boolean(trabajoEnFinalizacion)}
    	onClose={handleCerrarConfirmacionFinalizacion}
    	onConfirm={handleConfirmarFinalizacionTrabajo}
  	/>

  	<ModalSubirEvidenciasTrabajo
    	isOpen={Boolean(trabajoEnCargaEvidencia)}
    	onClose={handleCerrarSubirEvidencias}
    	onUpload={handleSubirEvidencias}
  	/>

  	<SuccessModal
    	isOpen={isSuccessOpen}
    	onClose={cerrarSuccess}
    	message={
      	successMessage || "Se cambió el estado del trabajo correctamente"
    	}
  	/>
	</>
  );
}

export default PanelGeneralProveedor;