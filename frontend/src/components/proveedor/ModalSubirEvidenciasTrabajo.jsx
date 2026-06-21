import { useMemo, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import Button from "../ui/Button";

function ModalSubirEvidenciasTrabajo({
  isOpen,
  onClose,
  onUpload,
}) {
  const inputFileRef = useRef(null);
  const [archivos, setArchivos] = useState([]);

  const puedeSubir = useMemo(() => archivos.length > 0, [archivos]);

  const abrirSelector = () => {
    inputFileRef.current?.click();
  };

  const handleFiles = (filesList) => {
    const lista = Array.from(filesList || []);
    setArchivos(lista);
  };

  const handleChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = () => {
    onUpload?.(archivos);
    setArchivos([]);
  };

  const handleClose = () => {
    setArchivos([]);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="subir-evidencias-title"
        className="
          relative z-10 flex w-full max-w-[520px] flex-col overflow-hidden
          rounded-xl border border-secondary/70 bg-surfaceSoft
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white">
          <h2 id="subir-evidencias-title" className="text-lg font-bold">
            Subir evidencias
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          <input
            ref={inputFileRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.heic,image/jpeg,image/png,image/heic"
            className="hidden"
            onChange={handleChange}
          />

          <div
            onClick={abrirSelector}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="
              flex min-h-[180px] cursor-pointer flex-col items-center justify-center
              rounded-xl border-2 border-primary/70 bg-white/60 px-6 py-8 text-center
              transition hover:bg-primarySoft/15
            "
          >
            <UploadCloud size={38} className="text-primary" />

            <p className="mt-4 text-lg font-bold text-primary">
              Arrastrá tus imágenes aquí
            </p>

            <p className="mt-2 text-sm text-textMuted">
              o hacé clic para seleccionar archivos
            </p>

            <p className="mt-3 text-xs text-textMuted">
              Formatos permitidos: JPG, PNG, HEIC · Máx. 10MB por archivo
            </p>
          </div>

          {archivos.length > 0 && (
            <div className="rounded-lg border border-border/70 bg-white/60 px-4 py-3">
              <p className="text-sm font-semibold text-textMain">
                {archivos.length} archivo(s) seleccionado(s)
              </p>

              <ul className="mt-2 space-y-1 text-xs text-textMuted">
                {archivos.map((archivo, index) => (
                  <li key={`${archivo.name}-${index}`} className="truncate">
                    {archivo.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap justify-center gap-5">
            <Button
              variant="elevated"
              size="md"
              type="button"
              onClick={handleUpload}
              disabled={!puedeSubir}
            >
              Subir
            </Button>

            <Button
              variant="neutral"
              size="md"
              type="button"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalSubirEvidenciasTrabajo;