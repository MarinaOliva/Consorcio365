import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Button from "../../../components/ui/Button";
import GridEstadisticasMantenimiento from "./componentes/GridEstadisticasMantenimiento";
import TablaPlanesMantenimiento from "./componentes/TablaPlanesMantenimiento";
import ModalNuevoPlanMantenimiento from "./componentes/ModalNuevoPlanMantenimiento";
import {
  ESTADISTICAS_MANTENIMIENTO,
  PLANES_MANTENIMIENTO_MOCK,
} from "../../../data/datosMantenimientoAdmin";
import {
  adminMenuItems,
  adminUser,
} from "../../../data/adminDashboardData";
import { useNavigate } from "react-router-dom";

function Mantenimiento() {
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const navigate = useNavigate();
  
  const [modalNuevoPlanAbierto, setModalNuevoPlanAbierto] = useState(false);
  const [planes, setPlanes] = useState(PLANES_MANTENIMIENTO_MOCK);

  const estadisticas = useMemo(() => ESTADISTICAS_MANTENIMIENTO, []);

  const planesFiltrados = useMemo(() => {
    if (filtroEstado === "Todos") return planes;

    return planes.filter((plan) => {
      const estadoPlan = (plan.estadoPlan || "").trim().toLowerCase();
      const estadoInstancia = (plan.estadoInstancia || "").trim().toLowerCase();

      if (filtroEstado === "Inactivo") {
        return estadoPlan === "inactivo";
      }

      if (filtroEstado === "Activo") {
        return estadoPlan === "activo";
      }

      if (filtroEstado === "Programado") {
        return estadoInstancia === "programado";
      }

      if (filtroEstado === "En curso") {
        return estadoInstancia === "en curso";
      }

      return true;
    });
  }, [planes, filtroEstado]);

  const abrirModalNuevoPlan = () => {
    setModalNuevoPlanAbierto(true);
  };

  const cerrarModalNuevoPlan = () => {
    setModalNuevoPlanAbierto(false);
  };

  const manejarCrearPlan = (nuevoPlan) => {
    const planCreado = {
      id: Date.now(),
      tarea: nuevoPlan.tarea.trim(),
      especialidad: nuevoPlan.especialidad.trim(),
      frecuencia: nuevoPlan.frecuencia,
      estadoPlan: "Activo",
      instanciaProgramada: nuevoPlan.fechaProgramada || "A programar",
      estadoInstancia: nuevoPlan.fechaProgramada ? "Programado" : "---",
      responsable: nuevoPlan.responsable.trim(),
    };

    setPlanes((prev) => [planCreado, ...prev]);
  };


  const manejarVerDetalle = (plan) => {
    navigate(`/admin/mantenimiento/${plan.id}`);
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="
                rounded-lg border border-border bg-white
                px-3 py-2 text-sm text-textMain
                outline-none transition
               focus:border-primary focus:ring-2 focus:ring-primary/20
           "
            >
              <option value="Todos">Estados: Todos</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Activo">Activo</option>
              <option value="Programado">Programado</option>
              <option value="En curso">En curso</option>
            </select>
          </div>
        </div>

        <TablaPlanesMantenimiento
          filas={planesFiltrados}
          onVerDetalle={manejarVerDetalle}
        />

        <ModalNuevoPlanMantenimiento
          isOpen={modalNuevoPlanAbierto}
          onClose={cerrarModalNuevoPlan}
          onCreate={manejarCrearPlan}
        />
      </section>
    </DashboardLayout>
  );
}

export default Mantenimiento;