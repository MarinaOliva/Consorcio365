import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../shared/SuccessModal";
import MiUnidadCard from "./MiUnidadCard";
import OcupanteReclamosList from "./OcupanteReclamosList";
import OcupanteAvisosList from "./OcupanteAvisosList";
import ModalNuevoReclamo from "./ModalNuevoReclamo";

import {
  miUnidadMock,
  reclamosMock,
  avisosMock,
} from "../../data/ocupanteDashboardData";

const RECLAMO_INICIAL = {
  titulo: "",
  descripcion: "",
  ubicacion: "",
  categoria: "",
  prioridad: "",
  archivos: [],
};

function formatearFechaActual() {
  return new Date().toLocaleDateString("es-AR");
}

function mapearPrioridadAEstado(prioridad) {
  const valor = String(prioridad || "").toLowerCase();

  if (valor === "alta") return "Abierta";
  if (valor === "media") return "Abierta";
  return "Abierta";
}

function PanelGeneralOcupante() {
  const navigate = useNavigate();

  const [reclamos, setReclamos] = useState(reclamosMock);
  const [avisos] = useState(avisosMock);

  const [isNuevoReclamoOpen, setIsNuevoReclamoOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [formReclamo, setFormReclamo] = useState(RECLAMO_INICIAL);

  const unidadActual = useMemo(() => {
    return {
      ...miUnidadMock,
      ocupante: "María Lozana",
      edificio: miUnidadMock.torre,
    };
  }, []);

  const handleAbrirNuevoReclamo = () => {
    setFormReclamo(RECLAMO_INICIAL);
    setIsNuevoReclamoOpen(true);
  };

  const handleCerrarNuevoReclamo = () => {
    setIsNuevoReclamoOpen(false);
  };

  const handleChangeReclamo = (campo, valor) => {
    setFormReclamo((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCrearReclamo = () => {
    const nuevoReclamo = {
      id: Date.now(),
      titulo: formReclamo.titulo,
      fecha: formatearFechaActual(),
      estado: mapearPrioridadAEstado(formReclamo.prioridad),
      descripcion: formReclamo.descripcion,
      ubicacion: formReclamo.ubicacion,
      categoria: formReclamo.categoria,
      prioridad: formReclamo.prioridad,
      archivos: formReclamo.archivos,
    };

    setReclamos((prev) => [nuevoReclamo, ...prev]);
    setIsNuevoReclamoOpen(false);
    setIsSuccessOpen(true);
    setFormReclamo(RECLAMO_INICIAL);

    // Más adelante:
    // await createIncidenciaRequest(...)
  };

  const handleIrAReclamos = () => {
    navigate("/ocupante/reclamos");
  };

  const handleIrAAvisos = () => {
    navigate("/ocupante/avisos");
  };

  return (
    <>
      <section className="mx-auto max-w-[1120px] space-y-6">
        <MiUnidadCard unidad={miUnidadMock} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OcupanteReclamosList
            reclamos={reclamos}
            onNuevo={handleAbrirNuevoReclamo}
            onVerTodas={handleIrAReclamos}
          />

          <OcupanteAvisosList
            avisos={avisos}
            onVerTodos={handleIrAAvisos}
          />
        </div>
      </section>

      <ModalNuevoReclamo
        isOpen={isNuevoReclamoOpen}
        onClose={handleCerrarNuevoReclamo}
        onCreate={handleCrearReclamo}
        form={formReclamo}
        onChange={handleChangeReclamo}
        unidadActual={unidadActual}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message="Su reclamo ha sido creado con éxito"
      />
    </>
  );
}

export default PanelGeneralOcupante;