import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import ContenedorPanelPorRol from "../../../components/dashboard/ContenedorPanelPorRol";
import SectionCard from "../../../components/dashboard/SectionCard";
import Button from "../../../components/ui/Button";
import SuccessModal from "../../../components/shared/SuccessModal";

import {
  getDocumentos,
  createDocumento,
  deleteDocumento,
} from "../../../services/documentosService";
import { getEdificios } from "../../../services/edificiosService";

import FiltrosDocumentosAdmin from "./componentes/FiltrosDocumentosAdmin";
import TablaDocumentosAdmin from "./componentes/TablaDocumentosAdmin";
import { mostrarToastError } from "../../../utils/toasts";

const TAMANIO_MAXIMO_ARCHIVO = 5 * 1024 * 1024;
const TIPOS_MIME_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
const EXTENSIONES_PERMITIDAS = ".pdf,.jpg,.jpeg,.png";

const CATEGORIAS_DOCUMENTO = [
  { value: "reglamento", label: "Reglamento" },
  { value: "acta", label: "Acta" },
  { value: "informe", label: "Informe" },
  { value: "plano", label: "Plano" },
  { value: "contrato", label: "Contrato" },
  { value: "otro", label: "Otro" },
];

const VISIBILIDADES_DOCUMENTO = [
  { value: "todos", label: "Todos" },
  { value: "solo_ocupantes", label: "Solo ocupantes" },
  { value: "solo_admin", label: "Solo administrador" },
];

const ESTADO_DOCUMENTO_INICIAL = {
  titulo: "",
  tipo: "",
  visibilidad: "todos",
  archivo: null,
};

const CLASE_CAMPO_MODAL = `
  h-9 w-full rounded-lg border border-slate-300 bg-white
  px-3 text-sm text-slate-800 shadow-sm
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-purple-900/40
`;

function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

function ModalCargarDocumento({
  isOpen,
  onClose,
  onSave,
  valores,
  errores,
  arrastreActivo,
  subiendo = false,
  categorias = [],
  visibilidades = [],
  onChangeCampo,
  onSeleccionarArchivo,
  onDragOverZona,
  onDragLeaveZona,
  onDropZona,
}) {
  const inputArchivoRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cargar-documento-title"
        className="
        relative z-10 flex w-full max-w-[640px] max-h-[90dvh] flex-col overflow-hidden
        rounded-2xl border border-white/40 bg-[#cfd8dc]
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]
      "
      >
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2 id="cargar-documento-title" className="text-base font-bold">
            Cargar Documento
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1 transition hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Título <span className="text-primary">*</span>
            </label>

            <input
              type="text"
              value={valores.titulo}
              onChange={(e) => onChangeCampo("titulo", e.target.value)}
              placeholder="Ingrese el título del documento"
              className={CLASE_CAMPO_MODAL}
            />

            {errores.titulo ? (
              <p className="text-xs font-medium text-red-500">
                {errores.titulo}
              </p>
            ) : null}
          </div>

          <div className="max-w-[295px] space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Tipo <span className="text-primary">*</span>
            </label>

            <select
              value={valores.tipo}
              onChange={(e) => onChangeCampo("tipo", e.target.value)}
              className={CLASE_CAMPO_MODAL}
            >
              <option value="">Seleccione</option>
              {categorias.map((categoria) => (
                <option key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </option>
              ))}
            </select>

            {errores.tipo ? (
              <p className="text-xs font-medium text-red-500">{errores.tipo}</p>
            ) : null}
          </div>
            
          <div className="max-w-[295px] space-y-2">
            <label className="block text-sm font-semibold text-textMain">
            Visibilidad <span className="text-primary">*</span>
            </label>

            <select
            value={valores.visibilidad}
            onChange={(e) => onChangeCampo("visibilidad", e.target.value)}
            className={CLASE_CAMPO_MODAL}
            >
            {visibilidades.map((vis) => (
              <option key={vis.value} value={vis.value}>
                {vis.label}
              </option>
            ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Comprobante <span className="text-primary">*</span>
            </label>

            <div
              onDrop={onDropZona}
              onDragOver={onDragOverZona}
              onDragLeave={onDragLeaveZona}
              onClick={() => inputArchivoRef.current?.click()}
              className={`
                flex min-h-[150px] cursor-pointer flex-col items-center justify-center
                rounded-xl border bg-white px-6 py-6 text-center shadow-sm transition
                ${
                  arrastreActivo
                    ? "border-primary bg-primarySoft/30"
                    : "border-border hover:border-primary/40"
                }
              `}
            >
              <input
                ref={inputArchivoRef}
                type="file"
                accept={EXTENSIONES_PERMITIDAS}
                onChange={(e) =>
                  onSeleccionarArchivo(e.target.files?.[0] || null)
                }
                className="hidden"
              />

              <Upload size={44} className="mb-4 text-primary" />

              {valores.archivo ? (
                <>
                  <p className="text-base font-bold text-textMain">
                    {valores.archivo.name}
                  </p>

                  <p className="mt-2 text-xs text-textMuted">
                    {(valores.archivo.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <p className="mt-3 text-xs font-semibold text-primary">
                    Haga clic para cambiar el archivo
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-bold text-textMain">
                    Haga clic o arrastre el archivo aquí
                  </p>

                  <p className="mt-2 text-xs text-textMuted">
                    PDF, JPG, PNG o docx (máx. 5MB)
                  </p>
                </>
              )}
            </div>

            {errores.archivo ? (
              <p className="text-xs font-medium text-red-500">
                {errores.archivo}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center gap-6 border-t border-border px-6 py-5">
          <Button 
           variant="elevated" 
           type="button" 
           onClick={onSave}
           disabled={subiendo}
          >
           {subiendo ? "Subiendo..." : "Guardar"}
          </Button>

          <Button
            variant="neutral"
            type="button"
            onClick={onClose}
            disabled={subiendo}
            className="border-red-300 text-red-500 hover:border-red-400 hover:bg-red-50"
            >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

function DocumentosAdmin() {
  const [documentos, setDocumentos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");

  const [modalCargarAbierto, setModalCargarAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);

  const [documentoDraft, setDocumentoDraft] = useState(ESTADO_DOCUMENTO_INICIAL);
  const [errores, setErrores] = useState({});
  const [arrastreActivo, setArrastreActivo] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  // Cargar documentos y edificios al montar
  useEffect(() => {
	let activo = true;

	async function cargarDatos() {
  	try {
    	const [dataDocumentos, dataEdificios] = await Promise.all([
      	getDocumentos(),
      	getEdificios(),
    	]);

    	if (!activo) return;
    	setDocumentos(dataDocumentos);
    	setEdificios(dataEdificios);
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

	cargarDatos();

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
        normalizarTexto(documento.nombre).includes(textoBusqueda) ||
        String(documento.id).includes(textoBusqueda.replace("#", ""));

      return coincideTipo && coincideBusqueda;
    });
  }, [documentos, busqueda, tipoFiltro]);

  const resetearFormulario = () => {
    setDocumentoDraft(ESTADO_DOCUMENTO_INICIAL);
    setErrores({});
    setArrastreActivo(false);
  };

  const abrirModalCargarDocumento = () => {
    setModalCargarAbierto(true);
  };

  const cerrarModalCargarDocumento = () => {
    setModalCargarAbierto(false);
    resetearFormulario();
  };

  const actualizarCampoDocumento = (campo, valor) => {
    setDocumentoDraft((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    setErrores((prev) => ({
      ...prev,
      [campo]: "",
    }));
  };

  const validarArchivo = (archivo) => {
    if (!archivo) {
      setErrores((prev) => ({
        ...prev,
        archivo: "Adjuntá un archivo.",
      }));
      return false;
    }

    if (!TIPOS_MIME_PERMITIDOS.includes(archivo.type)) {
      setErrores((prev) => ({
        ...prev,
        archivo: "Formato inválido. Solo se permite PDF, JPG o PNG.",
      }));
      return false;
    }

    if (archivo.size > TAMANIO_MAXIMO_ARCHIVO) {
      setErrores((prev) => ({
        ...prev,
        archivo: "El archivo supera el máximo permitido de 5MB.",
      }));
      return false;
    }

    setErrores((prev) => ({
      ...prev,
      archivo: "",
    }));

    return true;
  };

  const seleccionarArchivo = (archivo) => {
    if (!archivo) return;

    const esValido = validarArchivo(archivo);
    if (!esValido) return;

    setDocumentoDraft((prev) => ({
      ...prev,
      archivo,
    }));
  };

  const manejarDropZona = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(false);

    const archivo = event.dataTransfer.files?.[0] || null;
    seleccionarArchivo(archivo);
  };

  const manejarDragOverZona = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(true);
  };

  const manejarDragLeaveZona = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(false);
  };

  const validarFormularioDocumento = () => {
    const nuevosErrores = {};

    if (!documentoDraft.titulo.trim()) {
      nuevosErrores.titulo = "Ingresá el título del documento.";
    }

    if (!documentoDraft.tipo) {
      nuevosErrores.tipo = "Seleccioná un tipo.";
    }

    if (!documentoDraft.archivo) {
      nuevosErrores.archivo = "Adjuntá un archivo.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarDocumento = async () => {
    if (!validarFormularioDocumento()) return;

    const edificioId = edificios[0]?._id;
    if (!edificioId) {
      mostrarToastError("No hay edificios disponibles para asociar el documento")
      return;
    };
    

    setSubiendo(true);

    try {
    const formData = new FormData();
    formData.append("edificioId", edificioId);
    formData.append("nombre", documentoDraft.titulo.trim());
    formData.append("categoria", documentoDraft.tipo);
    formData.append("visibilidad", documentoDraft.visibilidad);
    formData.append("archivo", documentoDraft.archivo);

    const documentoCreado = await createDocumento(formData);

    setDocumentos((prev) => [documentoCreado, ...prev]);
    setModalCargarAbierto(false);
    resetearFormulario();
    setModalExitoAbierto(true);
    } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "No se pudo subir el documento";
    setErrores((prev) => ({ ...prev, archivo: msg }));
    mostrarToastError(msg);
    } finally {
    setSubiendo(false);
    }
  };



  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
  };

  const eliminarDocumento = async (documento) => {
    try {
      await deleteDocumento(documento._id);
      setDocumentos((prev) => prev.filter((item) => item._id !== documento._id));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo eliminar el documento";

     mostrarToastError(msg);
    }
  };

  const descargarDocumento = (documento) => {
    if (documento.url) {
      window.open(documento.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <ContenedorPanelPorRol titulo="Documentos" subtitulo="Gestión de archivos">
      <section className="mx-auto max-w-[1120px] space-y-5">
        <FiltrosDocumentosAdmin
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          tiposDisponibles={CATEGORIAS_DOCUMENTO}
          onSubirDocumento={abrirModalCargarDocumento}
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
            onEliminar={eliminarDocumento}
            onDescargar={descargarDocumento}
          />
          )}
        </SectionCard>
      </section>

      <ModalCargarDocumento
        isOpen={modalCargarAbierto}
        onClose={cerrarModalCargarDocumento}
        onSave={guardarDocumento}
        valores={documentoDraft}
        errores={errores}
        arrastreActivo={arrastreActivo}
        subiendo={subiendo}
        categorias={CATEGORIAS_DOCUMENTO}
        visibilidades={VISIBILIDADES_DOCUMENTO}
        onChangeCampo={actualizarCampoDocumento}
        onSeleccionarArchivo={seleccionarArchivo}
        onDragOverZona={manejarDragOverZona}
        onDragLeaveZona={manejarDragLeaveZona}
        onDropZona={manejarDropZona}
      />

      <SuccessModal
        isOpen={modalExitoAbierto}
        onClose={cerrarModalExito}
        message="Documento subido con éxito"
      />
    </ContenedorPanelPorRol>
  );
}

export default DocumentosAdmin;