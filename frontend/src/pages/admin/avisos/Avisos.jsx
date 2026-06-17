import { useMemo, useState } from "react";

import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import SuccessModal from "../../../components/shared/SuccessModal";

import { AVISOS_ADMIN_MOCK } from "../../../data/avisosAdminData";

import FiltrosAvisosAdmin from "./componentes/FiltrosAvisosAdmin";
import TarjetaAvisoAdmin from "./componentes/TarjetaAvisoAdmin";
import ModalEditarAviso from "./componentes/ModalEditarAviso";

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function convertirFechaISOaArgentina(fechaISO) {
  if (!fechaISO) return "";

  const [anio, mes, dia] = fechaISO.split("-");
  if (!anio || !mes || !dia) return fechaISO;

  return `${dia}/${mes}/${anio}`;
}

function convertirFechaArgentinaADate(fecha) {
  if (!fecha) return null;

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

function estaDentroDelRangoFecha(fecha, filtro) {
  if (filtro === "Todos") return true;

  const fechaAviso = convertirFechaArgentinaADate(fecha);

  if (!fechaAviso) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);
  const fechaLimite = new Date();

  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaAviso >= fechaLimite && fechaAviso <= hoy;
}

const AVISO_INICIAL = {
  id: null,
  edificio: "Torre Norte",
  titulo: "",
  descripcion: "",
  fechaPublicacion: "",
};

function AvisosAdmin() {
  const [avisos, setAvisos] = useState(AVISOS_ADMIN_MOCK);

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  const [modalAvisoAbierto, setModalAvisoAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [avisoDraft, setAvisoDraft] = useState(AVISO_INICIAL);

  const [modalExitoEdicionAbierto, setModalExitoEdicionAbierto] =
    useState(false);

  const [modalExitoEliminacionAbierto, setModalExitoEliminacionAbierto] =
    useState(false);

  const avisosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda);

    return avisos.filter((aviso) => {
      const coincideFecha = estaDentroDelRangoFecha(
        aviso.fechaPublicacion,
        fechaFiltro
      );

      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(aviso.titulo).includes(textoBusqueda) ||
        normalizarTexto(aviso.descripcion).includes(textoBusqueda) ||
        normalizarTexto(aviso.edificio).includes(textoBusqueda) ||
        String(aviso.id).includes(textoBusqueda.replace("#", ""));

      return coincideFecha && coincideBusqueda;
    });
  }, [avisos, busqueda, fechaFiltro]);

  const cerrarModalAviso = () => {
    setModalAvisoAbierto(false);
    setAvisoDraft(AVISO_INICIAL);
  };

  const handleNuevoAviso = () => {
    setModoModal("crear");
    setAvisoDraft({
      ...AVISO_INICIAL,
      fechaPublicacion: new Date().toISOString().slice(0, 10),
    });
    setModalAvisoAbierto(true);
  };

  const handleEditarAviso = (aviso) => {
    const fechaDate = convertirFechaArgentinaADate(aviso.fechaPublicacion);

    const fechaISO = fechaDate
      ? fechaDate.toISOString().slice(0, 10)
      : "";

    setModoModal("editar");
    setAvisoDraft({
      ...aviso,
      fechaPublicacion: fechaISO,
    });
    setModalAvisoAbierto(true);
  };

  const handleEliminarAviso = (aviso) => {
    setAvisos((prev) => prev.filter((item) => item.id !== aviso.id));
    setModalExitoEliminacionAbierto(true);
  };

  const actualizarCampoAviso = (campo, valor) => {
    setAvisoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarAviso = () => {
    const avisoNormalizado = {
      ...avisoDraft,
      fechaPublicacion: convertirFechaISOaArgentina(avisoDraft.fechaPublicacion),
    };

    if (modoModal === "crear") {
      const nuevoAviso = {
        ...avisoNormalizado,
        id: Date.now(),
      };

      setAvisos((prev) => [nuevoAviso, ...prev]);
    } else {
      setAvisos((prev) =>
        prev.map((item) =>
          item.id === avisoNormalizado.id ? avisoNormalizado : item
        )
      );
    }

    setModalAvisoAbierto(false);
    setAvisoDraft(AVISO_INICIAL);
    setModalExitoEdicionAbierto(true);
  };

  return (
    <ContenedorPanelPorRol
      titulo="Avisos"
      subtitulo="Gestión de comunicaciones"
    >
      <section className="mx-auto max-w-[1120px] space-y-5">
        <FiltrosAvisosAdmin
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          fechaFiltro={fechaFiltro}
          setFechaFiltro={setFechaFiltro}
          onNuevoAviso={handleNuevoAviso}
        />

        {avisosFiltrados.length > 0 ? (
          avisosFiltrados.map((aviso) => (
            <TarjetaAvisoAdmin
              key={aviso.id}
              aviso={aviso}
              onEditar={handleEditarAviso}
              onEliminar={handleEliminarAviso}
            />
          ))
        ) : (
          <div
            className="
              rounded-xl border border-secondary/70 bg-white px-6 py-8 text-center
              shadow-[3px_5px_8px_rgba(7,40,48,0.25)]
            "
          >
            <p className="text-sm font-semibold text-textMain">
              No se encontraron avisos.
            </p>
            <p className="mt-1 text-xs text-textMuted">
              Probá ajustar la búsqueda o el filtro por fecha.
            </p>
          </div>
        )}
      </section>

      <ModalEditarAviso
        isOpen={modalAvisoAbierto}
        onClose={cerrarModalAviso}
        onSave={guardarAviso}
        valores={avisoDraft}
        onChangeCampo={actualizarCampoAviso}
        modo={modoModal}
      />

      <SuccessModal
        isOpen={modalExitoEdicionAbierto}
        onClose={() => setModalExitoEdicionAbierto(false)}
        message={
          modoModal === "crear"
            ? "Aviso creado con éxito"
            : "Aviso editado con éxito"
        }
      />

      <SuccessModal
        isOpen={modalExitoEliminacionAbierto}
        onClose={() => setModalExitoEliminacionAbierto(false)}
        message="Aviso eliminado con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default AvisosAdmin;