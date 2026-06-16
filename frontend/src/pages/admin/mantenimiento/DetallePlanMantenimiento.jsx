import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Card from "../../../components/ui/Card";
import {
  adminMenuItems,
  adminUser,
} from "../../../data/adminDashboardData";
import {
  PLANES_MANTENIMIENTO_MOCK,
} from "../../../data/datosMantenimientoAdmin";
import { determinarCasoDetallePlan } from "./utils/determinarCasoDetallePlan.js";
import VistaDetallePlanInactivo from "./componentes/detalle/VistaDetallePlanInactivo";
import ConfirmacionActivarPlan from "./componentes/detalle/ConfirmacionActivarPlan";
import SuccessModal from "../../../components/shared/SuccessModal";
import VistaDetallePlanActivo from "./componentes/detalle/VistaDetallePlanActivo";

const DETALLES_PLANES_POR_ID = {
  1: {
    tareaDetalle: "Mantenimiento preventivo de ascensores",
    edificio: "Torre Norte",
    proveedorAsignado: "Ascensores Rápidos SA",
    ultimaInstancia: {
      proveedor: "Juan Carlos Pond",
      especialidad: "Electromecánica",
      monto: 100000,
      fecha: "04/04/2026",
      comprobanteUrl: "#",
    },
    historialInstancias: [
      { fechaProgramada: "14/05/26", monto: 98500, estado: "Cancelada" },
      { fechaProgramada: "10/04/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/03/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/02/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/01/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/12/25", monto: 98500, estado: "Completada" },
    ],
  },

  2: {
    tareaDetalle: "Mantenimiento preventivo de ascensores",
    edificio: "Torre Norte",
    proveedorAsignado: "Ascensores Rápidos SA",
    ultimaInstancia: {
      proveedor: "Juan Carlos Pond",
      especialidad: "Electromecánica",
      monto: 100000,
      fecha: "04/04/2026",
      comprobanteUrl: "#",
    },

    proximaInstancia: {
      fechaProgramada: "20/01/2024",
      trabajoAsociadoId: 2,
    },

    historialInstancias: [
      { fechaProgramada: "14/05/26", monto: 98500, estado: "Cancelada" },
      { fechaProgramada: "10/04/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/03/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/02/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/01/26", monto: 98500, estado: "Completada" },
      { fechaProgramada: "08/12/25", monto: 98500, estado: "Completada" },
    ],
  },

  3: {
    tareaDetalle: "Limpieza integral de tanques",
    edificio: "Torre Norte",
    proveedorAsignado: "Sanitank Servicios",
    ultimaInstancia: {
      proveedor: "Sanitank Servicios",
      especialidad: "Limpieza",
      monto: 35900,
      fecha: "11/01/2026",
      comprobanteUrl: "#",
    },
    historialInstancias: [
      { fechaProgramada: "11/01/26", monto: 35900, estado: "Completada" },
      { fechaProgramada: "11/10/25", monto: 33600, estado: "Completada" },
    ],
  },

  4: {
    tareaDetalle: "Mantenimiento preventivo de bombas",
    edificio: "Torre Norte",
    proveedorAsignado: "Bombas y Motores SRL",
    ultimaInstancia: {
      proveedor: "Bombas y Motores SRL",
      especialidad: "Mecánica",
      monto: 40200,
      fecha: "02/05/2026",
      comprobanteUrl: "#",
    },
    historialInstancias: [
      { fechaProgramada: "02/05/26", monto: 40200, estado: "Completada" },
      { fechaProgramada: "02/04/26", monto: 39800, estado: "Completada" },
    ],
  },

  5: {
    tareaDetalle: "Mantenimiento de tablero eléctrico general",
    edificio: "Torre Norte",
    proveedorAsignado: "ElectroServicios SA",
    ultimaInstancia: {
      proveedor: "ElectroServicios SA",
      especialidad: "Eléctrico",
      monto: 42500,
      fecha: "14/01/2026",
      comprobanteUrl: "#",
    },
    proximaInstancia: {
      fechaProgramada: "20/01/2024",
      trabajoAsociadoId: 2,
    },
    historialInstancias: [
      { fechaProgramada: "14/01/26", monto: 42500, estado: "Completada" },
      { fechaProgramada: "14/12/25", monto: 41200, estado: "Completada" },
    ],
    varianteAccionFinal: "alternativa",
  },
};

function DetallePlanMantenimiento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const idNumerico = Number(id);

  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

  const planBase = useMemo(
    () => PLANES_MANTENIMIENTO_MOCK.find((item) => item.id === idNumerico),
    [idNumerico]
  );

  const planInicial = useMemo(() => {
    if (!planBase) return null;

    return {
      ...planBase,
      ...DETALLES_PLANES_POR_ID[idNumerico],
    };
  }, [planBase, idNumerico]);

  const [cambiosPlan, setCambiosPlan] = useState({});
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);

  const planActual = useMemo(() => {
    if (!planInicial) return null;

    return {
      ...planInicial,
      ...cambiosPlan,
    };
  }, [planInicial, cambiosPlan]);

  const casoDetalle = useMemo(
    () => determinarCasoDetallePlan(planActual || {}),
    [planActual]
  );

  const volverAListado = () => {
    navigate("/admin/mantenimiento");
  };

  const abrirConfirmacionActivacion = () => {
    setModalConfirmacionAbierto(true);
  };

  const cerrarConfirmacionActivacion = () => {
    setModalConfirmacionAbierto(false);
  };

  const confirmarActivacionPlan = () => {
    setCambiosPlan({
      estadoPlan: "Activo",
      instanciaProgramada: "A programar",
      estadoInstancia: "---",
    });

    cerrarConfirmacionActivacion();
    setModalExitoAbierto(true);
  };

  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    navigate("/admin/mantenimiento");
  };

  const mostrarVistaInactiva =
  casoDetalle === "inactivo" || modalExitoAbierto;
  
  if (!planActual) {
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
              No se encontró el plan solicitado
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

  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      user={adminUser}
      title={planActual.tarea}
      subtitle="Detalle de plan"
    >
      {mostrarVistaInactiva ? (
        <>
          <VistaDetallePlanInactivo
            plan={planActual}
            onVolver={volverAListado}
            onActivarPlan={abrirConfirmacionActivacion}
          />

          <ConfirmacionActivarPlan
            isOpen={modalConfirmacionAbierto}
            onClose={cerrarConfirmacionActivacion}
            onConfirm={confirmarActivacionPlan}
            nombrePlan={planActual.tarea}
          />

          <SuccessModal
            isOpen={modalExitoAbierto}
            onClose={cerrarModalExito}
            message="El plan ha sido activado correctamente."
          />
        </>
      ) : (
        <VistaDetallePlanActivo
          plan={planActual}
          caso={casoDetalle}
          onVolver={volverAListado}
        />
      )}
    </DashboardLayout>
  );
}

export default DetallePlanMantenimiento;