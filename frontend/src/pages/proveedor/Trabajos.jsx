import { useMemo, useState } from "react";
import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";

import FiltrosHistorialTrabajosProveedor from "../../components/proveedor/FiltrosHistorialTrabajosProveedor";
import TablaHistorialTrabajosProveedor from "../../components/proveedor/TablaHistorialTrabajosProveedor";
import ModalDetalleHistorialTrabajoProveedor from "../../components/proveedor/ModalDetalleHistorialTrabajoProveedor";

import { useTrabajosProveedor } from "../../hooks/useTrabajosProveedor";

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function convertirFechaArgentinaADate(fecha) {
  if (!fecha) return null;

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

function estaDentroDelRango(fecha, filtro) {
  if (filtro === "Todos") return true;

  const fechaTrabajo = convertirFechaArgentinaADate(fecha);
  if (!fechaTrabajo) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);
  const fechaLimite = new Date();

  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaTrabajo >= fechaLimite && fechaTrabajo <= hoy;
}

function TrabajosProveedor() {

  const { trabajosHistoricos } = useTrabajosProveedor();
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);

  const trabajosBaseProveedor = trabajosHistoricos; 

  const trabajosFiltrados = useMemo(() => {
    return trabajosBaseProveedor.filter((trabajo) => {
      const coincideEstado =
        estadoFiltro === "Todos" || trabajo.estado === estadoFiltro;

      const coincideFecha = estaDentroDelRango(
        trabajo.fechaFinalizacion || trabajo.fecha,
        fechaFiltro
      );

      const textoBusqueda = normalizarTexto(busqueda);

      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(trabajo.titulo || trabajo.incidencia).includes(textoBusqueda) ||
        normalizarTexto(trabajo.estado).includes(textoBusqueda) ||
        normalizarTexto(trabajo.edificio).includes(textoBusqueda) ||
        normalizarTexto(trabajo.unidad).includes(textoBusqueda);

      return coincideEstado && coincideFecha && coincideBusqueda;
    });
  }, [trabajosBaseProveedor, estadoFiltro, fechaFiltro, busqueda]);

  return (
    <ContenedorPanelPorRol
      titulo="Historial de trabajos"
      subtitulo="Trabajos finalizados y cerrados"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        {/* Filtros */}
        <FiltrosHistorialTrabajosProveedor
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
          fechaFiltro={fechaFiltro}
          setFechaFiltro={setFechaFiltro}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />

        {/* Tabla */}
        <TablaHistorialTrabajosProveedor
          trabajos={trabajosFiltrados}
          totalTrabajos={trabajosBaseProveedor.length}
          onVerDetalle={setTrabajoSeleccionado}
        />
      </section>

      <ModalDetalleHistorialTrabajoProveedor
        isOpen={Boolean(trabajoSeleccionado)}
        trabajo={trabajoSeleccionado}
        onClose={() => setTrabajoSeleccionado(null)}
      />
    </ContenedorPanelPorRol>
  );
}

export default TrabajosProveedor;