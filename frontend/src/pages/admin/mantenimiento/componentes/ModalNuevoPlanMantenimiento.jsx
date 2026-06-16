import { useState } from "react";
import { X, InfoIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";

const ESTADO_INICIAL = {
  tarea: "",
  especialidad: "",
  frecuencia: "",
  fechaProgramada: "",
  responsable: "",
};
const CLASE_CAMPO_MODAL = `
  h-8 w-full rounded-lg border border-slate-300 bg-white
  px-3 text-sm text-slate-800 shadow-sm
  outline-none transition
  placeholder:text-textMuted
  focus:border-primary focus:ring-2 focus:ring-purple-900/40
`;
function ModalNuevoPlanMantenimiento({
  isOpen,
  onClose,
  onCreate,
}) {
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});

  if (!isOpen) return null;

  const resetearFormulario = () => {
    setFormulario(ESTADO_INICIAL);
    setErrores({});
  };

  const cerrarModal = () => {
    resetearFormulario();
    onClose?.();
  };

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    setErrores((prev) => ({
      ...prev,
      [campo]: "",
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.tarea.trim()) {
      nuevosErrores.tarea = "Ingresá la tarea.";
    }

    if (!formulario.especialidad.trim()) {
      nuevosErrores.especialidad = "Ingresá la especialidad.";
    }

    if (!formulario.frecuencia) {
      nuevosErrores.frecuencia = "Seleccioná una frecuencia.";
    }

    if (!formulario.responsable.trim()) {
      nuevosErrores.responsable = "Ingresá el responsable.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleCrear = () => {
    if (!validarFormulario()) return;

    onCreate?.(formulario);
    cerrarModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-2">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={cerrarModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nuevo-plan-mantenimiento-title"
        className="
          relative z-10 flex w-full max-w-[560px] flex-col overflow-hidden
          rounded-2xl border border-white/40 bg-[#cfd8dc]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-2.5 text-white">
          <h2
            id="nuevo-plan-mantenimiento-title"
            className="text-base font-bold"
          >
            Nuevo plan de mantenimiento
          </h2>

          <button
            type="button"
            onClick={cerrarModal}
            aria-label="Cerrar"
            className="rounded-md p-1 transition hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-8 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Tarea <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formulario.tarea}
              onChange={(e) => actualizarCampo("tarea", e.target.value)}
              placeholder="Ingresá la tarea"
              className={CLASE_CAMPO_MODAL}
            />
            {errores.tarea ? (
              <p className="text-xs font-medium text-red-500">
                {errores.tarea}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Especialidad <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formulario.especialidad}
                onChange={(e) =>
                  actualizarCampo("especialidad", e.target.value)
                }
                placeholder="Ej: Eléctrico"
                className={CLASE_CAMPO_MODAL}
              />
              {errores.especialidad ? (
                <p className="text-xs font-medium text-red-500">
                  {errores.especialidad}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Frecuencia <span className="text-primary">*</span>
              </label>
              <select
                value={formulario.frecuencia}
                onChange={(e) => actualizarCampo("frecuencia", e.target.value)}
                className={CLASE_CAMPO_MODAL}
              >
                <option value="">Seleccione una opción</option>
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
              {errores.frecuencia ? (
                <p className="text-xs font-medium text-red-500">
                  {errores.frecuencia}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Fecha programada
              </label>
              <input
                type="date"
                value={formulario.fechaProgramada}
                onChange={(e) =>
                  actualizarCampo("fechaProgramada", e.target.value)
                }
                className={CLASE_CAMPO_MODAL}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Responsable <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formulario.responsable}
                onChange={(e) => actualizarCampo("responsable", e.target.value)}
                placeholder="Proveedor o responsable"
                className={CLASE_CAMPO_MODAL}
              />
              {errores.responsable ? (
                <p className="text-xs font-medium text-red-500">
                  {errores.responsable}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <div className="flex items-start gap-3">
            <InfoIcon size={22} className="mt-0.5 shrink-0 text-primary" />

            <p className="text-sm leading-relaxed text-textMain">
              Una vez creado el plan podrás generar instancias programadas según
              la frecuencia seleccionada.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-5 border-t border-border px-6 py-4">
          <Button variant="elevated" type="button" onClick={handleCrear}>
            Crear
          </Button>

          <Button variant="neutral" type="button" onClick={cerrarModal}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalNuevoPlanMantenimiento;
