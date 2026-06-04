import { useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import EditableInput from "../dashboard/fields/EditableInput";
import RadioGroup from "../dashboard/fields/RadioGroup";
import { buildingUnitsLong } from "../../data/unitsData";

const ROLES = ["Administrador", "Ocupante", "Proveedor"];
const TIPOS_DOCUMENTO = ["DNI", "CUIT", "Pasaporte"];
const ROLES_UNIDAD = ["PROPIETARIO", "INQUILINO"];
const RUBROS = ["Plomero", "Electricista", "Ascensores", "Pintor", "Gasista"];

const CONDICIONES_FISCALES = [
  "Monotributista",
  "Responsable Inscripto",
  "Exento",
  "Consumidor Final",
];

const ESTADO_INICIAL = {
  // Paso 1
  name: "",
  lastName: "",
  email: "",
  temporaryPassword: "",
  role: "",

  // Ocupante
  unit: "",
  unitRole: "",
  docType: "",
  docNumber: "",
  phone: "",
  resides: "Si",

  // Proveedor
  category: "",
  taxStatus: "",
  address: "",
  specialty: "",
  license: "",
  companyName: "",

  // General
  status: "Pendiente",
};

function CampoSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seleccione una opción",
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900/40"
        >
          <option value="">{placeholder}</option>

          {options.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f5b66]">
          <ChevronDown size={18} />
        </span>
      </div>
    </div>
  );
}

function NuevoUsuarioModal({ onClose, onCreate }) {
  const [paso, setPaso] = useState("datos");
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);
  const [error, setError] = useState("");

  const rolSeleccionado = (formulario.role || "").trim().toLowerCase();

  const esAdmin = rolSeleccionado === "administrador";
  const esOcupante = rolSeleccionado === "ocupante";
  const esProveedor = rolSeleccionado === "proveedor";

  const titulo = useMemo(() => {
    if (paso === "datos") return "Datos del usuario";
    if (esProveedor) return "Agregar prestador";
    if (esOcupante) return "Agregar ocupante";
    return "Nuevo usuario";
  }, [paso, esProveedor, esOcupante]);

  const panelMaxClass =
    paso === "detalles" && esProveedor ? "max-w-[720px]" : "max-w-[560px]";

  const reiniciarFormulario = () => {
    setPaso("datos");
    setFormulario(ESTADO_INICIAL);
    setError("");
  };

  const cerrarModal = () => {
    reiniciarFormulario();
    onClose?.();
  };

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => {
      if (campo === "role") {
        return {
          ...prev,
          role: valor,

          // Limpieza de datos específicos al cambiar de rol
          unit: "",
          unitRole: "",
          docType: "",
          docNumber: "",
          phone: "",
          resides: "Si",

          category: "",
          taxStatus: "",
          address: "",
          specialty: "",
          license: "",
          companyName: "",
        };
      }

      return {
        ...prev,
        [campo]: valor,
      };
    });

    setError("");
  };

  const validarPasoDatos = () => {
    if (!formulario.name.trim()) return "Ingresá los nombres.";
    if (!formulario.lastName.trim()) return "Ingresá los apellidos.";
    if (!formulario.email.trim()) return "Ingresá el correo electrónico.";

    if (!formulario.temporaryPassword.trim()) {
      return "Ingresá la contraseña temporal.";
    }

    if (!formulario.role) return "Seleccioná el rol del usuario.";

    return "";
  };

  const validarPasoDetalles = () => {
    if (esOcupante) {
      if (!formulario.unit) return "Seleccioná la unidad.";
      if (!formulario.unitRole) return "Seleccioná el rol en la unidad.";
      if (!formulario.docType) return "Seleccioná el tipo de documento.";
      if (!formulario.docNumber.trim()) return "Ingresá el número de documento.";

      if (!formulario.phone.trim()) {
        return "Ingresá el número de teléfono o celular.";
      }

      return "";
    }

    if (esProveedor) {
      if (!formulario.category) return "Seleccioná el tipo de proveedor.";
      if (!formulario.taxStatus) return "Seleccioná la condición fiscal.";
      if (!formulario.docType) return "Seleccioná el tipo de documento.";
      if (!formulario.docNumber.trim()) return "Ingresá el número de documento.";

      if (!formulario.phone.trim()) {
        return "Ingresá el número de teléfono o celular.";
      }

      if (!formulario.address.trim()) return "Ingresá la dirección.";
      if (!formulario.specialty.trim()) return "Ingresá la especialidad.";

      if (!formulario.license.trim()) {
        return "Ingresá la matrícula o cédula profesional.";
      }

      return "";
    }

    return "";
  };

  const crearUsuario = () => {
    onCreate?.({
      ...formulario,
      status: formulario.status || "Pendiente",
    });
  };

  const handleAccionPasoDatos = () => {
    const mensajeError = validarPasoDatos();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError("");

    if (esAdmin) {
      crearUsuario();
      return;
    }

    setPaso("detalles");
  };

  const handleFinalizar = () => {
    const mensajeError = validarPasoDetalles();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError("");
    crearUsuario();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={cerrarModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nuevo-usuario-title"
        className={`relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-[#cfd8dc] shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${panelMaxClass}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-secondary px-6 py-4 text-white">
          <h2 id="nuevo-usuario-title" className="text-base font-bold">
            {titulo}
          </h2>

          <button
            onClick={cerrarModal}
            className="rounded-md p-1 transition hover:bg-white/15"
            aria-label="Cerrar"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {paso === "datos" && (
            <div className="space-y-5">
              <EditableInput
                label="Nombres"
                value={formulario.name}
                onChange={(v) => actualizarCampo("name", v)}
                showIcon={false}
              />

              <EditableInput
                label="Apellidos"
                value={formulario.lastName}
                onChange={(v) => actualizarCampo("lastName", v)}
                showIcon={false}
              />

              <EditableInput
                label="Correo electrónico"
                value={formulario.email}
                onChange={(v) => actualizarCampo("email", v)}
                showIcon={false}
                type="email"
              />

              <EditableInput
                label="Contraseña temporal"
                value={formulario.temporaryPassword}
                onChange={(v) => actualizarCampo("temporaryPassword", v)}
                showIcon={false}
                type="text"
              />

              <CampoSelect
                label="Seleccione el rol"
                value={formulario.role}
                onChange={(v) => actualizarCampo("role", v)}
                options={ROLES}
                placeholder="Seleccione el rol"
              />
            </div>
          )}

          {paso === "detalles" && esOcupante && (
            <div className="space-y-5">
              <CampoSelect
                label="Seleccione la unidad"
                value={formulario.unit}
                onChange={(v) => actualizarCampo("unit", v)}
                options={buildingUnitsLong}
                placeholder="Seleccione la unidad"
              />

              <CampoSelect
                label="Rol en la unidad"
                value={formulario.unitRole}
                onChange={(v) => actualizarCampo("unitRole", v)}
                options={ROLES_UNIDAD}
                placeholder="Rol en la unidad"
              />

              <CampoSelect
                label="Tipo de documento"
                value={formulario.docType}
                onChange={(v) => actualizarCampo("docType", v)}
                options={TIPOS_DOCUMENTO}
                placeholder="Tipo de documento"
              />

              <EditableInput
                label="Número de documento"
                value={formulario.docNumber}
                onChange={(v) => actualizarCampo("docNumber", v)}
                showIcon={false}
              />

              <EditableInput
                label="Número de teléfono o celular"
                value={formulario.phone}
                onChange={(v) => actualizarCampo("phone", v)}
                showIcon={false}
              />

              <RadioGroup
                label="¿Reside en la unidad?"
                name="nuevo-ocupante-resides"
                value={formulario.resides}
                options={["Si", "No"]}
                onChange={(v) => actualizarCampo("resides", v)}
              />
            </div>
          )}

          {paso === "detalles" && esProveedor && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CampoSelect
                label="Tipo de proveedor"
                value={formulario.category}
                onChange={(v) => actualizarCampo("category", v)}
                options={RUBROS}
                placeholder="Tipo de proveedor"
              />

              <CampoSelect
                label="Condición fiscal"
                value={formulario.taxStatus}
                onChange={(v) => actualizarCampo("taxStatus", v)}
                options={CONDICIONES_FISCALES}
                placeholder="Condición fiscal"
              />

              <CampoSelect
                label="Tipo de documento"
                value={formulario.docType}
                onChange={(v) => actualizarCampo("docType", v)}
                options={TIPOS_DOCUMENTO}
                placeholder="Tipo de documento"
              />

              <EditableInput
                label="Número de documento"
                value={formulario.docNumber}
                onChange={(v) => actualizarCampo("docNumber", v)}
                showIcon={false}
              />

              <EditableInput
                label="Número de teléfono o celular"
                value={formulario.phone}
                onChange={(v) => actualizarCampo("phone", v)}
                showIcon={false}
              />

              <EditableInput
                label="Dirección"
                value={formulario.address}
                onChange={(v) => actualizarCampo("address", v)}
                showIcon={false}
              />

              <EditableInput
                label="Especialidad"
                value={formulario.specialty}
                onChange={(v) => actualizarCampo("specialty", v)}
                showIcon={false}
              />

              <EditableInput
                label="Matrícula o cédula profesional"
                value={formulario.license}
                onChange={(v) => actualizarCampo("license", v)}
                showIcon={false}
              />

              <div className="md:col-span-2">
                <EditableInput
                  label="Nombre de la empresa"
                  value={formulario.companyName}
                  onChange={(v) => actualizarCampo("companyName", v)}
                  showIcon={false}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-5 border-t border-border px-6 py-5">
          {paso === "datos" ? (
            <>
              <Button
                variant="elevated"
                size="md"
                onClick={handleAccionPasoDatos}
                type="button"
              >
                {esAdmin ? "Finalizar" : "Siguiente"}
              </Button>

              <Button
                variant="neutral"
                size="md"
                onClick={cerrarModal}
                type="button"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="elevated"
                size="md"
                onClick={handleFinalizar}
                type="button"
              >
                Finalizar
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setPaso("datos");
                  setError("");
                }}
                type="button"
              >
                Volver
              </Button>

              <Button
                variant="neutral"
                size="md"
                onClick={cerrarModal}
                type="button"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NuevoUsuarioModal;