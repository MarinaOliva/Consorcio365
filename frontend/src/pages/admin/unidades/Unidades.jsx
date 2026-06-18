import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import SuccessModal from "../../../components/shared/SuccessModal";

import VistaListadoUnidades from "./componentes/VistaListadoUnidades";
import VistaDetalleUnidad from "./componentes/VistaDetalleUnidad";
import VistaEdicionUnidad from "./componentes/VistaEdicionUnidad";
import { useUnidadesAdmin } from "../../../hooks/useUnidades";

function Unidades() {
  const {
    estadoFiltro,
    setEstadoFiltro,
    busqueda,
    setBusqueda,
    unidadesFiltradas,
    totalUnidades,
    unidadSeleccionada,
    unidadEnEdicion,
    isSuccessOpen,
    successMessage,
    abrirDetalleUnidad,
    abrirEdicionUnidad,
    cerrarVistaUnidad,
    cerrarModalExito,
    actualizarCampoUnidad,
    actualizarRelacionUsuario,
    finalizarRelacionUsuario,
    guardarCambiosUnidad,
  } = useUnidadesAdmin();

  const subtitulo = unidadEnEdicion
    ? "Editar unidad"
    : unidadSeleccionada
    ? "Detalles de unidad"
    : "Gestión de las unidades del edificio";

  return (
    <ContenedorPanelPorRol titulo="Unidades" subtitulo={subtitulo}>
      <section className="mx-auto max-w-[1120px] space-y-5">
        {unidadEnEdicion ? (
          <VistaEdicionUnidad
            unidad={unidadEnEdicion}
            onVolver={cerrarVistaUnidad}
            onActualizarCampo={actualizarCampoUnidad}
            onActualizarRelacionUsuario={actualizarRelacionUsuario}
            onFinalizarRelacionUsuario={finalizarRelacionUsuario}
            onGuardar={guardarCambiosUnidad}
            onCancelar={cerrarVistaUnidad}
          />
        ) : unidadSeleccionada ? (
          <VistaDetalleUnidad
            unidad={unidadSeleccionada}
            onVolver={cerrarVistaUnidad}
          />
        ) : (
          <VistaListadoUnidades
            estadoFiltro={estadoFiltro}
            busqueda={busqueda}
            unidades={unidadesFiltradas}
            totalUnidades={totalUnidades}
            onCambiarEstado={setEstadoFiltro}
            onCambiarBusqueda={setBusqueda}
            onVerDetalle={abrirDetalleUnidad}
            onEditar={abrirEdicionUnidad}
          />
        )}
      </section>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={cerrarModalExito}
        message={successMessage}
      />
    </ContenedorPanelPorRol>
  );
}

export default Unidades;