import { useParams } from "react-router-dom";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Card from "../../../components/ui/Card";
import SuccessModal from "../../../components/shared/SuccessModal";
import CrearTrabajoModal from "../../../components/admin/CrearTrabajoModal";

import VistaDetallePlanInactivo from "./componentes/detalle/VistaDetallePlanInactivo";
import VistaDetallePlanActivo from "./componentes/detalle/VistaDetallePlanActivo";
import ConfirmacionActivarPlan from "./componentes/detalle/ConfirmacionActivarPlan";

import {
  adminMenuItems,
  adminUser,
} from "../../../data/adminDashboardData";

import { usePlanDetalle } from "../../../hooks/usePlanDetalle";

function DetallePlanMantenimiento() {
  const { id } = useParams();

  const {
	plan,
	caso,
	loading,
	error,

	fechaInstancia,
	setFechaInstancia,

	volverAListado,

	// Activación
	modalConfirmacionAbierto,
	abrirConfirmacionActivacion,
	cerrarConfirmacionActivacion,
	confirmarActivacionPlan,
	modalExitoActivacionAbierto,
	cerrarModalExitoActivacion,

	// Crear instancia
	handleCrearInstancia,
	modalInstanciaCreadaAbierto,
	cerrarModalInstanciaCreada,

	// Cerrar instancia
	modalCerrarInstanciaAbierto,
	abrirModalCerrarInstancia,
	cerrarModalCerrarInstancia,
	confirmarCerrarInstancia,
	modalExitoCerrarAbierto,
	cerrarModalExitoCerrar,

	// Ver trabajo
	handleVerTrabajoAsociado,

	// Crear trabajo desde plan
	proveedoresActivos,
	instanciaPreseleccionada,
	modalCrearTrabajoAbierto,
	abrirModalCrearTrabajo,
	cerrarModalCrearTrabajo,
	trabajoDraft,
	handleChangeTrabajoDraft,
	handleCrearTrabajoDesdePlan,
	modalTrabajoCreadoAbierto,
	cerrarModalTrabajoCreado,
  } = usePlanDetalle(id);

  if (loading) {
	return (
  	<DashboardLayout
    	menuItems={adminMenuItems}
    	user={adminUser}
    	title="Detalle de plan"
    	subtitle="Cargando..."
  	>
    	<section className="mx-auto max-w-[1120px]">
      	<p className="py-6 text-sm text-textMuted">Cargando plan...</p>
    	</section>
  	</DashboardLayout>
	);
  }

  if (error || !plan) {
	return (
  	<DashboardLayout
    	menuItems={adminMenuItems}
    	user={adminUser}
    	title="Detalle de plan"
    	subtitle="Plan no encontrado"
  	>
    	<section className="mx-auto max-w-[1120px]">
      	<Card className="border-secondary/70 bg-white px-6 py-8 text-center shadow-[3px_5px_8px_rgba(7,40,48,0.25)]">
        	<h2 className="text-lg font-bold text-primary">
          	{error || "No se encontró el plan solicitado"}
        	</h2>

        	<button
          	type="button"
          	onClick={volverAListado}
          	className="mt-4 text-sm font-medium text-primary hover:underline"
        	>
          	Volver al listado
        	</button>
      	</Card>
    	</section>
  	</DashboardLayout>
	);
  }

  const mostrarVistaInactiva = caso === "inactivo" || modalExitoActivacionAbierto;

  return (
	<DashboardLayout
  	menuItems={adminMenuItems}
  	user={adminUser}
  	title={plan.tarea}
  	subtitle="Detalle de plan"
	>
  	{mostrarVistaInactiva ? (
    	<>
      	<VistaDetallePlanInactivo
        	plan={plan}
        	onVolver={volverAListado}
        	onActivarPlan={abrirConfirmacionActivacion}
      	/>

      	<ConfirmacionActivarPlan
        	isOpen={modalConfirmacionAbierto}
        	onClose={cerrarConfirmacionActivacion}
        	onConfirm={confirmarActivacionPlan}
        	nombrePlan={plan.tarea}
      	/>

      	<SuccessModal
        	isOpen={modalExitoActivacionAbierto}
        	onClose={cerrarModalExitoActivacion}
        	message="El plan ha sido activado correctamente."
      	/>
    	</>
  	) : (
    	<>
      	<VistaDetallePlanActivo
        	plan={plan}
        	caso={caso}
        	onVolver={volverAListado}
        	fechaInstancia={fechaInstancia}
        	setFechaInstancia={setFechaInstancia}
        	onCrearInstancia={handleCrearInstancia}
        	onCerrarInstancia={abrirModalCerrarInstancia}
        	onVerTrabajo={handleVerTrabajoAsociado}
        	onCrearTrabajo={abrirModalCrearTrabajo}
      	/>

      	{/* Modal cerrar instancia */}
      	{modalCerrarInstanciaAbierto && (
        	<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          	<div
            	className="absolute inset-0 bg-black/40"
            	onClick={cerrarModalCerrarInstancia}
          	/>
          	<div className="relative z-10 w-full max-w-[560px] rounded-2xl border border-white/40 bg-[#cfd8dc] px-8 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            	<h2 className="mx-auto max-w-[420px] text-[18px] font-bold leading-tight text-primary">
              	Al cerrar esta instancia se generará automáticamente un gasto de tipo PREVENTIVO
            	</h2>
            	<div className="mt-8 flex flex-wrap justify-center gap-6">
              	<button
                	onClick={confirmarCerrarInstancia}
                	className="rounded-full bg-primary px-6 py-2 text-white"
              	>
                	Aceptar
              	</button>
              	<button
                	onClick={cerrarModalCerrarInstancia}
                	className="rounded-full border border-red-300 px-6 py-2 text-red-500"
              	>
                	Cancelar
              	</button>
            	</div>
          	</div>
        	</div>
      	)}

      	{/* Modal crear trabajo (reusa el de Trabajos) */}
      	<CrearTrabajoModal
        	isOpen={modalCrearTrabajoAbierto}
        	onClose={cerrarModalCrearTrabajo}
        	onCreate={handleCrearTrabajoDesdePlan}
        	values={trabajoDraft}
        	onChange={handleChangeTrabajoDraft}
        	proveedoresDisponibles={proveedoresActivos}
        	instanciaPreseleccionada={instanciaPreseleccionada}
      	/>

      	<SuccessModal
        	isOpen={modalInstanciaCreadaAbierto}
        	onClose={cerrarModalInstanciaCreada}
        	message="Instancia creada con éxito"
      	/>

      	<SuccessModal
        	isOpen={modalExitoCerrarAbierto}
        	onClose={cerrarModalExitoCerrar}
        	message="Instancia cerrada. Gasto creado con éxito"
      	/>

      	<SuccessModal
        	isOpen={modalTrabajoCreadoAbierto}
        	onClose={cerrarModalTrabajoCreado}
        	message="Trabajo creado con éxito"
      	/>
    	</>
  	)}
	</DashboardLayout>
  );
}

export default DetallePlanMantenimiento;