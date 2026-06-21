import { mostrarToastError } from "../../../utils/toasts";

import { useEffect, useMemo, useState } from "react";

import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import SuccessModal from "../../../components/shared/SuccessModal";

import {
  getAvisos,
  createAviso,
  updateAviso,
  deleteAviso,
} from "../../../services/avisosService";
import { getEdificios } from "../../../services/edificiosService";

import FiltrosAvisosAdmin from "./componentes/FiltrosAvisosAdmin";
import TarjetaAvisoAdmin from "./componentes/TarjetaAvisoAdmin";
import ModalEditarAviso from "./componentes/ModalEditarAviso";
import ModalConfirmacion from "../../../components/shared/ModalConfirmacion";

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function estaDentroDelRangoFecha(fecha, filtro) {
  if (filtro === "Todos") return true;
  if (!fecha) return false;

  const fechaAviso = new Date(fecha);
  if (isNaN(fechaAviso.getTime())) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);
  const fechaLimite = new Date();

  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaAviso >= fechaLimite && fechaAviso <= hoy;
}

const AVISO_INICIAL = {
  _id: null,
  edificioId: "",
  titulo: "",
  cuerpo: "",
  fechaPublicacion: "",
};

function AvisosAdmin() {
  const [avisos, setAvisos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isConfirmarEliminacionOpen, setIsConfirmarEliminacionOpen] = useState(false);
  const [avisoAEliminar, setAvisoAEliminar] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  const [modalAvisoAbierto, setModalAvisoAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [avisoDraft, setAvisoDraft] = useState(AVISO_INICIAL);

  const [modalExitoEdicionAbierto, setModalExitoEdicionAbierto] =
    useState(false);

  const [modalExitoEliminacionAbierto, setModalExitoEliminacionAbierto] =
    useState(false);

  // Cargar avisos y edificios al montar
  useEffect(() => {
	let activo = true;

	async function cargarDatos() {
  	try {
    	const [dataAvisos, dataEdificios] = await Promise.all([
      	getAvisos(),
      	getEdificios(),
    	]);

    	if (!activo) return;
    	setAvisos(dataAvisos);
    	setEdificios(dataEdificios);
  	} catch (err) {
    	if (!activo) return;
    	const msg =
      	err?.response?.data?.message ||
      	err?.message ||
      	"No se pudieron cargar los avisos";
    	setError(msg);
  	} finally {
    	if (activo) setLoading(false);
  	}
	}

	cargarDatos();

	return () => {
  	activo = false;
	};
  }, []);

  const avisosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda);

    return avisos.filter((aviso) => {
      const coincideFecha = estaDentroDelRangoFecha(
        aviso.fechaPublicacion,
        fechaFiltro
      );
      
      const nombreEdificio = aviso.edificioId?.nombre || ""; 

      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(aviso.titulo).includes(textoBusqueda) ||
        normalizarTexto(aviso.cuerpo).includes(textoBusqueda) ||
        normalizarTexto(nombreEdificio).includes(textoBusqueda) ||
        String(aviso._id).includes(textoBusqueda.replace("#", ""));

      return coincideFecha && coincideBusqueda;
    });
  }, [avisos, busqueda, fechaFiltro]);

  const cerrarModalAviso = () => {
    setModalAvisoAbierto(false);
    setAvisoDraft(AVISO_INICIAL);
  };

  const handleNuevoAviso = () => {
  setModoModal("crear");
  // Si hay edificios, preseleccionamos el primero
  const edificioPorDefecto = edificios[0]?._id || "";
  setAvisoDraft({
	...AVISO_INICIAL,
	edificioId: edificioPorDefecto,
	fechaPublicacion: new Date().toISOString().slice(0, 10),
  });
  setModalAvisoAbierto(true);
  };

  const handleEditarAviso = (aviso) => {
  const fechaDate = aviso.fechaPublicacion ? new Date(aviso.fechaPublicacion) : null;
  const fechaISO =
	fechaDate && !isNaN(fechaDate.getTime())
  	? fechaDate.toISOString().slice(0, 10)
  	: "";

  setModoModal("editar");
  setAvisoDraft({
	...aviso,
	edificioId: aviso.edificioId?._id || aviso.edificioId || "",
	fechaPublicacion: fechaISO,
  });
  setModalAvisoAbierto(true);
  };

  const handleEliminarAviso = (aviso) => {
    setAvisoAEliminar(aviso);
    setIsConfirmarEliminacionOpen(true);
  };

  const handleCancelarEliminacionAviso = () => {
  setAvisoAEliminar(null);
  setIsConfirmarEliminacionOpen(false);
};

  const handleConfirmarEliminacionAviso = async () => {
    if (!avisoAEliminar) return;

    try {
      await deleteAviso(avisoAEliminar._id);

      setAvisos((prev) =>
        prev.filter((item) => item._id !== avisoAEliminar._id)
      );

      setIsConfirmarEliminacionOpen(false);
      setAvisoAEliminar(null);
      setModalExitoEliminacionAbierto(true);
    } catch (err) {
      const msg =
      err?.response?.data?.message ||
      err?.message ||
      "No se pudo eliminar el aviso";

      setIsConfirmarEliminacionOpen(false);
      setAvisoAEliminar(null);
      mostrarToastError(msg);
    }
  };

  const actualizarCampoAviso = (campo, valor) => {
    setAvisoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

const guardarAviso = async () => {
  // Validaciones básicas
  if (!avisoDraft.titulo.trim()) {
	mostrarToastError("Ingresá un título.");
	return;
  }
  if (!avisoDraft.cuerpo.trim()) {
	mostrarToastError("Ingresá el contenido del aviso.");
	return;
  }
  if (!avisoDraft.edificioId) {
	mostrarToastError("Seleccioná un edificio.");
	return;
  }

  try {
	const payload = {
  	edificioId: avisoDraft.edificioId,
  	titulo: avisoDraft.titulo.trim(),
  	cuerpo: avisoDraft.cuerpo.trim(),
  	fechaPublicacion: avisoDraft.fechaPublicacion,
	};

	let avisoGuardado;
	if (modoModal === "crear") {
  	avisoGuardado = await createAviso(payload);
  	setAvisos((prev) => [avisoGuardado, ...prev]);
	} else {
  	avisoGuardado = await updateAviso(avisoDraft._id, payload);
  	setAvisos((prev) =>
    	prev.map((item) =>
      	item._id === avisoDraft._id ? avisoGuardado : item
    	)
  	);
	}

	setModalAvisoAbierto(false);
	setAvisoDraft(AVISO_INICIAL);
	setModalExitoEdicionAbierto(true);
  } catch (err) {
	const msg =
  	err?.response?.data?.message ||
  	err?.message ||
  	"No se pudo guardar el aviso";
	 mostrarToastError(msg);
  }
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

        {loading && (
          <p className="py-4 text-sm text-textMuted">Cargando avisos...</p>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          (avisosFiltrados.length > 0 ? (
            avisosFiltrados.map((aviso) => (
              <TarjetaAvisoAdmin
                key={aviso._id}
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
          ))}
      </section>

      <ModalEditarAviso
        isOpen={modalAvisoAbierto}
        onClose={cerrarModalAviso}
        onSave={guardarAviso}
        valores={avisoDraft}
        onChangeCampo={actualizarCampoAviso}
        modo={modoModal}
        edificios={edificios}
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




      <ModalConfirmacion
        isOpen={isConfirmarEliminacionOpen}
        title="Confirmar eliminación"
        message={
          avisoAEliminar
            ? `¿Querés eliminar el aviso "${avisoAEliminar.titulo}"?`
            : "¿Querés continuar con esta acción?"
        }
        confirmLabel="Eliminar aviso"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmarEliminacionAviso}
        onClose={handleCancelarEliminacionAviso}
        details={
          avisoAEliminar
            ? [
                { label: "Título", value: avisoAEliminar.titulo || "-" },
                {
                  label: "Edificio",
                  value: avisoAEliminar.edificioId?.nombre || "-",
                },
                {
                  label: "Fecha",
                  value: avisoAEliminar.fechaPublicacion
                    ? new Date(
                        avisoAEliminar.fechaPublicacion,
                      ).toLocaleDateString("es-AR")
                    : "-",
                },
              ]
            : []
        }
      />
    </ContenedorPanelPorRol>
  );
}

export default AvisosAdmin;