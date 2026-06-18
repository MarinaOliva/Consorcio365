import { useEffect, useMemo, useState } from "react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import FiltrosAvisosAdmin from "../admin/avisos/componentes/FiltrosAvisosAdmin";
import TarjetaAvisoAdmin from "../admin/avisos/componentes/TarjetaAvisoAdmin";

import { getAvisos } from "../../services/avisosService";

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

function AvisosOcupante() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("Todos");

  useEffect(() => {
	let activo = true;

	async function cargarAvisos() {
  	try {
    	const data = await getAvisos();
    	if (!activo) return;
    	setAvisos(data);
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

	cargarAvisos();

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
    	normalizarTexto(nombreEdificio).includes(textoBusqueda);

  	return coincideFecha && coincideBusqueda;
	});
  }, [avisos, busqueda, fechaFiltro]);

  return (
	<ContenedorPanelPorRol
  	titulo="Avisos"
  	subtitulo="Comunicaciones y novedades del edificio"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<FiltrosAvisosAdmin
      	busqueda={busqueda}
      	setBusqueda={setBusqueda}
      	fechaFiltro={fechaFiltro}
      	setFechaFiltro={setFechaFiltro}
      	onNuevoAviso={() => {}}
        mostrarBotonNuevo={false}
    	/>

    	{loading && (
      	<p className="py-4 text-sm text-textMuted">Cargando avisos...</p>
    	)}

    	{error && (
      	<div className="rounded-md border border-red-200 bg-red-50 p-3">
        	<p className="text-sm text-red-600">{error}</p>
      	</div>
    	)}

    	{!loading && !error && (
      	avisosFiltrados.length > 0 ? (
        	avisosFiltrados.map((aviso) => (
          	<TarjetaAvisoAdmin
            	key={aviso._id}
            	aviso={aviso}
            	mostrarAcciones={false}
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
      	)
    	)}
  	</section>
	</ContenedorPanelPorRol>
  );
}

export default AvisosOcupante;