import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../shared/SuccessModal";
import MiUnidadCard from "./MiUnidadCard";
import OcupanteReclamosList from "./OcupanteReclamosList";
import OcupanteAvisosList from "./OcupanteAvisosList";
import ModalNuevoReclamo from "./ModalNuevoReclamo";

import { useReclamosOcupante } from "../../hooks/useReclamosOcupante";
import { getAvisos } from "../../services/avisosService";

function PanelGeneralOcupante() {
  const navigate = useNavigate();

  const {
	reclamosFiltrados,
	loading: loadingReclamos,
	error: errorReclamos,
	unidadActual,

	isNuevoReclamoOpen,
	handleAbrirNuevoReclamo,
	handleCerrarNuevoReclamo,
	formReclamo,
	handleChangeReclamo,
	handleCrearReclamo,

	isSuccessOpen,
	cerrarSuccess,
  } = useReclamosOcupante();

  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
	let activo = true;
	getAvisos()
  	.then((data) => {
    	if (!activo) return;
    	setAvisos(data || []);
  	})
  	.catch(() => {
    	// Si falla, dejamos la lista vacía
  	});
	return () => {
  	activo = false;
	};
  }, []);

  // Adaptamos los avisos al formato que espera OcupanteAvisosList
  const avisosAdaptados = useMemo(() => {
	return avisos.slice(0, 3).map((a) => ({
  	id: a._id,
  	titulo: a.titulo,
  	descripcion: a.cuerpo || "",
  	fecha: a.fechaPublicacion
    	? new Date(a.fechaPublicacion).toLocaleDateString("es-AR")
    	: "",
  	prioridad: "media",
	}));
  }, [avisos]);

  // Solo mostramos los 5 reclamos más recientes
  const reclamosResumen = useMemo(() => {
	return reclamosFiltrados.slice(0, 5);
  }, [reclamosFiltrados]);

  // Datos de la unidad para mostrar en la card
  const unidadCard = useMemo(() => {
	return {
  	numero: unidadActual?.numero || "—",
  	piso: "Piso " + unidadActual?.piso || "—",
  	torre: unidadActual?.edificio || "—",
  	relacion: "Ocupante",
	};
  }, [unidadActual]);

  const handleIrAReclamos = () => navigate("/ocupante/reclamos");
  const handleIrAAvisos = () => navigate("/ocupante/avisos");

  return (
	<>
  	<section className="mx-auto max-w-[1120px] space-y-6">
    	<MiUnidadCard unidad={unidadCard} />

    	{loadingReclamos && (
      	<p className="py-4 text-sm text-textMuted">Cargando información...</p>
    	)}

    	{errorReclamos && !loadingReclamos && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-4">
        	<p className="text-sm font-semibold text-red-600">{errorReclamos}</p>
      	</div>
    	)}

    	{!loadingReclamos && !errorReclamos && (
      	<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        	<OcupanteReclamosList
          	reclamos={reclamosResumen}
          	onNuevo={handleAbrirNuevoReclamo}
          	onVerTodas={handleIrAReclamos}
        	/>

        	<OcupanteAvisosList
          	avisos={avisosAdaptados}
          	onVerTodos={handleIrAAvisos}
        	/>
      	</div>
    	)}
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
    	onClose={cerrarSuccess}
    	message="Su reclamo ha sido creado con éxito"
  	/>
	</>
  );
}

export default PanelGeneralOcupante;

