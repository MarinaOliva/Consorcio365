import { useEffect, useMemo, useState } from "react";

import ContenedorPanelPorRol from "../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../components/dashboard/SectionCard";

import FiltrosDocumentosAdmin from "../admin/documentos/componentes/FiltrosDocumentosAdmin";
import TablaDocumentosAdmin from "../admin/documentos/componentes/TablaDocumentosAdmin";

import { getDocumentos } from "../../services/documentosService";

const CATEGORIAS_DOCUMENTO = [
  { value: "reglamento", label: "Reglamento" },
  { value: "acta", label: "Acta" },
  { value: "informe", label: "Informe" },
  { value: "plano", label: "Plano" },
  { value: "contrato", label: "Contrato" },
  { value: "otro", label: "Otro" },
];

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function DocumentosOcupante() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");

  useEffect(() => {
	let activo = true;

	async function cargarDocumentos() {
  	try {
    	const data = await getDocumentos();
    	if (!activo) return;
    	setDocumentos(data);
  	} catch (err) {
    	if (!activo) return;
    	const msg =
      	err?.response?.data?.message ||
      	err?.message ||
      	"No se pudieron cargar los documentos";
    	setError(msg);
  	} finally {
    	if (activo) setLoading(false);
  	}
	}

	cargarDocumentos();

	return () => {
  	activo = false;
	};
  }, []);

  const documentosFiltrados = useMemo(() => {
	const textoBusqueda = normalizarTexto(busqueda);

	return documentos.filter((documento) => {
  	const coincideTipo =
    	tipoFiltro === "Todos" || documento.categoria === tipoFiltro;

  	const coincideBusqueda =
    	!textoBusqueda ||
    	normalizarTexto(documento.nombre).includes(textoBusqueda);

  	return coincideTipo && coincideBusqueda;
	});
  }, [documentos, busqueda, tipoFiltro]);

  const descargarDocumento = (documento) => {
	if (documento.url) {
  	window.open(documento.url, "_blank", "noopener,noreferrer");
	}
  };

  return (
	<ContenedorPanelPorRol
  	titulo="Documentos"
  	subtitulo="Documentación del edificio y del consorcio"
	>
  	<section className="mx-auto max-w-[1120px] space-y-5">
    	<FiltrosDocumentosAdmin
      	busqueda={busqueda}
      	setBusqueda={setBusqueda}
      	tipoFiltro={tipoFiltro}
      	setTipoFiltro={setTipoFiltro}
      	tiposDisponibles={CATEGORIAS_DOCUMENTO}
      	onSubirDocumento={() => {}}
      	mostrarBotonSubir={false}
    	/>

    	<SectionCard title="Listado de documentos">
      	{loading && (
        	<p className="py-4 text-sm text-textMuted">Cargando documentos...</p>
      	)}

      	{error && (
        	<div className="rounded-md border border-red-200 bg-red-50 p-3">
          	<p className="text-sm text-red-600">{error}</p>
        	</div>
      	)}

      	{!loading && !error && (
        	<TablaDocumentosAdmin
          	documentos={documentosFiltrados}
          	totalDocumentos={documentos.length}
          	onDescargar={descargarDocumento}
          	mostrarAcciones={false}
        	/>
      	)}
    	</SectionCard>
  	</section>
	</ContenedorPanelPorRol>
  );
}

export default DocumentosOcupante;