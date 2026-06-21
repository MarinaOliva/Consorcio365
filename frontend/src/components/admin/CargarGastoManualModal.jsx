import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Button from "../ui/Button";

const TAMANIO_MAXIMO_ARCHIVO = 5 * 1024 * 1024;
const TIPOS_MIME_PERMITIDOS = ["application/pdf", "image/jpeg", "image/png"];
const EXTENSIONES_PERMITIDAS = ".pdf,.jpg,.jpeg,.png";

function normalizarMontoInput(valor) {
  if (!valor) return "";
  return valor.replace(",", ".");
}

function CargarGastoManualModal({ isOpen, onClose, onSave }) {
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [arrastreActivo, setArrastreActivo] = useState(false);
  const [errores, setErrores] = useState({});
  const inputArchivoRef = useRef(null);

  const reiniciarFormulario = useCallback(() => {
    setMonto("");
    setConcepto("");
    setComprobante(null);
    setErrores({});
    setArrastreActivo(false);
  }, []);

  const handleClose = useCallback(() => {
    reiniciarFormulario();
    onClose?.();
  }, [onClose, reiniciarFormulario]);

  useEffect(() => {
    if (!isOpen) return;

    const overflowOriginal = document.body.style.overflow;

    const manejarTeclaPresionada = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manejarTeclaPresionada);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", manejarTeclaPresionada);
    };
  }, [isOpen, handleClose]);

  const validarArchivo = (archivo) => {
    if (!archivo) return false;

    if (!TIPOS_MIME_PERMITIDOS.includes(archivo.type)) {
      setErrores((prev) => ({
        ...prev,
        comprobante: "Formato inválido. Solo se permite PDF, JPG o PNG.",
      }));
      return false;
    }

    if (archivo.size > TAMANIO_MAXIMO_ARCHIVO) {
      setErrores((prev) => ({
        ...prev,
        comprobante: "El archivo supera el máximo permitido de 5MB.",
      }));
      return false;
    }

    setErrores((prev) => ({
      ...prev,
      comprobante: "",
    }));

    return true;
  };

  const procesarArchivo = (archivo) => {
    if (!archivo) return;

    const esArchivoValido = validarArchivo(archivo);
    if (!esArchivoValido) return;

    setComprobante(archivo);
  };

  const manejarCambioArchivo = (event) => {
    const archivo = event.target.files?.[0];
    procesarArchivo(archivo);
  };

  const manejarSoltarArchivo = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(false);

    const archivo = event.dataTransfer.files?.[0];
    procesarArchivo(archivo);
  };

  const manejarArrastreSobreZona = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(true);
  };

  const manejarSalidaDeArrastre = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setArrastreActivo(false);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!monto || Number(monto) <= 0) {
      nuevosErrores.monto = "Ingresá un monto válido.";
    }

    if (!concepto.trim()) {
      nuevosErrores.concepto = "Ingresá el concepto del gasto.";
    }

    if (!comprobante) {
      nuevosErrores.comprobante = "Adjuntá un comprobante.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validarFormulario()) return;

    onSave?.({
      monto: Number(normalizarMontoInput(monto)),
      concepto: concepto.trim(),
      comprobante,
    });

    reiniciarFormulario();
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
        aria-labelledby="cargar-gasto-manual-title"
        className="
          relative z-10 w-full max-w-[540px]
          max-h-[90dvh] overflow-hidden
          rounded-2xl border border-white/40
          bg-[#cfd8dc]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2 id="cargar-gasto-manual-title" className="text-base font-bold">
            Cargar Gasto Manual
          </h2>

          <button
            onClick={handleClose}
            className="rounded-md p-1 transition hover:bg-white/15"
            aria-label="Cerrar"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
          {/* Monto */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Monto *
            </label>

            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ingrese el monto del gasto"
                  className="
                    w-full bg-transparent px-4 py-3 text-left text-sm text-textMain
                    outline-none placeholder:text-textMuted
                  "
                />
              </div>
            </div>

            {errores.monto ? (
              <p className="text-xs font-medium text-red-500">
                {errores.monto}
              </p>
            ) : null}
          </div>

          {/* Concepto */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Concepto *
            </label>

            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ingrese el concepto del gasto"
              className="
                w-full rounded-lg border border-border bg-white px-4 py-3
                text-sm text-textMain shadow-sm
                outline-none transition
                placeholder:text-textMuted
                focus:border-primary focus:ring-2 focus:ring-primary/15
              "
            />

            {errores.concepto ? (
              <p className="text-xs font-medium text-red-500">
                {errores.concepto}
              </p>
            ) : null}
          </div>

          {/* Comprobante */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-textMain">
              Comprobante *
            </label>

            <div
              onDrop={manejarSoltarArchivo}
              onDragOver={manejarArrastreSobreZona}
              onDragLeave={manejarSalidaDeArrastre}
              onClick={() => inputArchivoRef.current?.click()}
              className={`
                flex min-h-[170px] cursor-pointer flex-col items-center justify-center
                rounded-xl border bg-white px-6 py-8 text-center shadow-sm transition
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
                onChange={manejarCambioArchivo}
                className="hidden"
              />

              <Upload size={36} className="mb-4 text-primary" />

              {comprobante ? (
                <>
                  <p className="text-base font-bold text-textMain">
                    {comprobante.name}
                  </p>
                  <p className="mt-2 text-xs text-textMuted">
                    {(comprobante.size / 1024 / 1024).toFixed(2)} MB
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
                    PDF, JPG o PNG (máx. 5MB)
                  </p>
                </>
              )}
            </div>

            {errores.comprobante ? (
              <p className="text-xs font-medium text-red-500">
                {errores.comprobante}
              </p>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-6 border-t border-border px-6 py-8 pb-3 pt-3">
          <Button onClick={handleSubmit} type="button" variant="elevated">
            Guardar
          </Button>

          <Button onClick={handleClose} type="button" variant="neutral">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CargarGastoManualModal;