import { Plus, CalendarCheck2, Clock3, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Button from "../../../components/ui/Button";
import GridEstadisticasMantenimiento from "./componentes/GridEstadisticasMantenimiento";
import TablaPlanesMantenimiento from "./componentes/TablaPlanesMantenimiento";
import ModalNuevoPlanMantenimiento from "./componentes/ModalNuevoPlanMantenimiento";
import SuccessModal from "../../../components/shared/SuccessModal";

import {
  adminMenuItems,
  adminUser,
} from "../../../data/adminDashboardData";

import { useMantenimiento } from "../../../hooks/useMantenimiento";

function Mantenimiento() {
  const navigate = useNavigate();

  const {
	planes,
	planesFiltrados,
	loading,
	error,
	filtroEstadoPlan,
	setFiltroEstadoPlan,
	filtroEstadoInstancia,
	setFiltroEstadoInstancia,
	modalNuevoPlanAbierto,
	abrirModalNuevoPlan,
	cerrarModalNuevoPlan,
	manejarCrearPlan,
	modalExitoAbierto,
	cerrarModalExito,
  } = useMantenimiento();

  const estadisticas = [
  {
    id: 1,
    titulo: "Planes activos",
    valor: String(planes.filter((p) => p.activo).length),
    icono: CalendarCheck2,
  },
  {
    id: 2,
    titulo: "Instancias próximas",
    valor: String(
      planes.filter((p) => p.proximaInstancia?.estado === "PROGRAMADA").length
    ),
    icono: Clock3,
  },
  {
    id: 3,
    titulo: "Instancias en curso",
    valor: String(
      planes.filter((p) => p.proximaInstancia?.estado === "EN_CURSO").length
    ),
    icono: CheckCircle2,
  },
];



  const manejarVerDetalle = (plan) => {
	navigate(`/admin/mantenimiento/${plan._id || plan.id}`);
  };

  return (
	<DashboardLayout
  	menuItems={adminMenuItems}
  	user={adminUser}
  	title="Planes de mantenimiento"
  	subtitle="Gestión de mantenimiento programado"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<div className="flex justify-end">
      	<Button variant="elevated" onClick={abrirModalNuevoPlan}>
        	<Plus size={16} className="mr-1.5" />
        	Nuevo plan
      	</Button>
    	</div>

    	<GridEstadisticasMantenimiento estadisticas={estadisticas} />

    	<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
      	<select
        	value={filtroEstadoPlan}
        	onChange={(e) => setFiltroEstadoPlan(e.target.value)}
        	className="
          	rounded-lg border border-border bg-white
          	px-3 py-2 text-sm text-textMain
          	outline-none transition
          	focus:border-primary focus:ring-2 focus:ring-primary/20
        	"
      	>
        	<option value="Todos">Estado plan: Todos</option>
        	<option value="Activo">Activo</option>
        	<option value="Inactivo">Inactivo</option>
      	</select>

      	<select
        	value={filtroEstadoInstancia}
        	onChange={(e) => setFiltroEstadoInstancia(e.target.value)}
        	className="
          	rounded-lg border border-border bg-white
          	px-3 py-2 text-sm text-textMain
          	outline-none transition
          	focus:border-primary focus:ring-2 focus:ring-primary/20
        	"
      	>
        	<option value="Todos">Estado instancia: Todos</option>
        	<option value="Programado">Programado</option>
        	<option value="En curso">En curso</option>
        	<option value="---">Sin instancia</option>
      	</select>
    	</div>

    	{loading && (
      	<p className="py-4 text-sm text-textMuted">
        	Cargando planes de mantenimiento...
      	</p>
    	)}

    	{error && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-3">
        	<p className="text-sm text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
      	<TablaPlanesMantenimiento
        	filas={planesFiltrados}
        	onVerDetalle={manejarVerDetalle}
      	/>
    	)}

    	<ModalNuevoPlanMantenimiento
      	isOpen={modalNuevoPlanAbierto}
      	onClose={cerrarModalNuevoPlan}
      	onCreate={manejarCrearPlan}
    	/>

    	<SuccessModal
      	isOpen={modalExitoAbierto}
      	onClose={cerrarModalExito}
      	message="Plan creado con éxito"
    	/>
  	</section>
	</DashboardLayout>
  );
}

export default Mantenimiento;

