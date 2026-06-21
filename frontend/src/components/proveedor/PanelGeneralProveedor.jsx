import { useState, useMemo } from "react";
import EspecialidadBanner from "./EspecialidadBanner";
import ProveedorStatsGrid from "./ProveedorStatsGrid";
import TrabajosActivosList from "./TrabajosActivosList";
import ModalDetalleTrabajoProveedor from "./ModalDetalleTrabajoProveedor";
import ModalConfirmarFinalizacionTrabajo from "./ModalConfirmarFinalizacionTrabajo";
import ModalSubirEvidenciasTrabajo from "./ModalSubirEvidenciasTrabajo";
import SuccessModal from "../shared/SuccessModal";
import {
  especialidadMock,
  trabajosActivosMock,
} from "../../data/proveedorDashboardData";


function PanelGeneralProveedor() {
  const [trabajos, setTrabajos] = useState(
    trabajosActivosMock.map((trabajo) => ({
      ...trabajo,
      evidencias: trabajo.evidencias || [],
    }))
  );

  const estadisticasDinamicas = useMemo(() => {
    const pendientes = trabajos.filter(
      (trabajo) => String(trabajo.estado || "").toLowerCase().trim() === "asignado",
    ).length;

    const enCurso = trabajos.filter(
      (trabajo) =>
        String(trabajo.estado || "").toLowerCase().trim() === "en progreso",
    ).length;

    const finalizados = trabajos.filter(
      (trabajo) =>
        String(trabajo.estado || "").toLowerCase().trim() === "finalizado",
    ).length;

    return {
      pendientes,
      enCurso,
      finalizados,
    };
  }, [trabajos]);

  const trabajosActivos = useMemo(() => {
    return trabajos.filter((trabajo) => {
      const estado = String(trabajo.estado || "").toLowerCase().trim();

      return estado === "asignado" || estado === "en progreso";
    });
  }, [trabajos]);
 

  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  
  const [trabajoEnFinalizacion, setTrabajoEnFinalizacion] = useState(null);
  const [trabajoEnCargaEvidencia, setTrabajoEnCargaEvidencia] = useState(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerDetalleTrabajo = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
  };

  const handleCerrarDetalleTrabajo = () => {
    setTrabajoSeleccionado(null);
  };

  
  const handleMarcarEnProgreso = (trabajo) => {
    const actualizado = {
      ...trabajo,
      estado: "En progreso",
    };

    setTrabajos((prev) =>
      prev.map((item) =>
        item.id === trabajo.id ? actualizado : item
      )
    );

    setTrabajoSeleccionado(null);
    setSuccessMessage("Se cambió el estado del trabajo correctamente");
    setIsSuccessOpen(true);
  };

  
const handleAbrirConfirmacionFinalizacion = (trabajo) => {
    setTrabajoSeleccionado(null);
    setTrabajoEnFinalizacion(trabajo);
  };

  const handleCerrarConfirmacionFinalizacion = () => {
    setTrabajoEnFinalizacion(null);
  };

  const handleConfirmarFinalizacionTrabajo = () => {
    if (!trabajoEnFinalizacion) return;

    const actualizado = {
      ...trabajoEnFinalizacion,
      estado: "Finalizado",
    };

    setTrabajos((prev) =>
      prev.map((item) =>
        item.id === trabajoEnFinalizacion.id ? actualizado : item
      )
    );

    setTrabajoEnFinalizacion(null);
    setSuccessMessage("Trabajo finalizado correctamente");
    setIsSuccessOpen(true);
  };

  const handleAbrirSubirEvidencias = (trabajo) => {
    setTrabajoSeleccionado(null);
    setTrabajoEnCargaEvidencia(trabajo);
  };

  const handleCerrarSubirEvidencias = () => {
    setTrabajoEnCargaEvidencia(null);
  };

  const handleSubirEvidencias = (archivos) => {
    if (!trabajoEnCargaEvidencia || !archivos?.length) return;

    const actualizado = {
      ...trabajoEnCargaEvidencia,
      evidencias: [...(trabajoEnCargaEvidencia.evidencias || []), ...archivos],
    };

    setTrabajos((prev) =>
      prev.map((item) =>
        item.id === trabajoEnCargaEvidencia.id ? actualizado : item
      )
    );

    setTrabajoEnCargaEvidencia(null);
    setSuccessMessage("Archivo subido con éxito");
    setIsSuccessOpen(true);
  };

  return (
    <>
      <section className="mx-auto max-w-[1120px] space-y-5">
        <EspecialidadBanner especialidad={especialidadMock} />

        <ProveedorStatsGrid stats={estadisticasDinamicas} />

        <TrabajosActivosList
          trabajos={trabajosActivos}
          onVerDetalle={handleVerDetalleTrabajo}
        />
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
        onClose={() => setIsSuccessOpen(false)}
        message={
          successMessage || "Se cambió el estado del trabajo correctamente"
        }
      />
    </>
  );
}

export default PanelGeneralProveedor;