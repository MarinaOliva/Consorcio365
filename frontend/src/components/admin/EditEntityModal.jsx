import { X } from "lucide-react";
import EditableInput from "../dashboard/fields/EditableInput";
import SelectField from "../dashboard/fields/SelectField";
import RadioGroup from "../dashboard/fields/RadioGroup";
import { buildingUnitsLong } from "../../data/unitsData";

/* ---------- Forms ---------- */
function UserForm({ values, onChange, readOnly }) {
  return (
	<div className="space-y-5">
  	<EditableInput label="Nombre" value={values?.name ?? ""} onChange={(v) => onChange("name", v)} readOnly={readOnly} />
  	<EditableInput label="Apellido" value={values?.lastName ?? ""} onChange={(v) => onChange("lastName", v)} readOnly={readOnly} />
  	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
  	<EditableInput label="N° Teléfono / Celular" value={values?.phone ?? ""} onChange={(v) => onChange("phone", v)} readOnly={readOnly} />
  	<SelectField label="Tipo de Documento" value={values?.docType ?? "DNI"} options={["DNI", "Pasaporte", "CUIT"]} onChange={(v) => onChange("docType", v)} disabled={readOnly} />
  	<EditableInput label="N° Documento" value={values?.docNumber ?? ""} onChange={(v) => onChange("docNumber", v)} readOnly={readOnly} />
  	<SelectField label="Seleccionar Unidad" value={values?.unit ?? ""} options={buildingUnitsLong} onChange={(v) => onChange("unit", v)} disabled={readOnly} />
  	<SelectField label="Rol en la Unidad" value={values?.unitRole ?? "PROPIETARIO"} options={["PROPIETARIO", "INQUILINO"]} onChange={(v) => onChange("unitRole", v)} disabled={readOnly} />
  	<RadioGroup label="Estado" name="status" value={values?.status ?? "Activo"} options={["Activo", "Inactivo"]} onChange={(v) => onChange("status", v)} />
  	<RadioGroup label="¿Reside en la unidad?" name="resides" value={values?.resides ?? "Si"} options={["Si", "No"]} onChange={(v) => onChange("resides", v)} />
	</div>
  );
}

function AdminForm({ values, onChange, readOnly }) {
  return (
	<div className="space-y-5">
  	<EditableInput label="Nombre" value={values?.name ?? ""} onChange={(v) => onChange("name", v)} readOnly={readOnly} />
  	<EditableInput label="Apellido" value={values?.lastName ?? ""} onChange={(v) => onChange("lastName", v)} readOnly={readOnly} />
  	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
	</div>
  );
}

function ProviderForm({ values, onChange, readOnly }) {
  const docTypes = ["DNI", "CUIT", "Pasaporte"];
  const rubros = ["Plomero", "Electricista", "Ascensores", "Pintor", "Gasista"];
  const taxStatuses = ["Monotributista", "Responsable Inscripto", "Exento", "Consumidor Final"];
  const specialties = ["Instalaciones Sanitarias", "Electricidad", "Ascensores", "Mantenimiento General", "Pintura"];

  return (
	<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
  	<EditableInput label="Nombre" value={values?.name ?? ""} onChange={(v) => onChange("name", v)} readOnly={readOnly} />
  	<EditableInput label="Dirección" value={values?.address ?? ""} onChange={(v) => onChange("address", v)} readOnly={readOnly} />
  	<EditableInput label="Apellido" value={values?.lastName ?? ""} onChange={(v) => onChange("lastName", v)} readOnly={readOnly} />
  	<SelectField label="Rubro" value={values?.category ?? ""} options={rubros} onChange={(v) => onChange("category", v)} disabled={readOnly} />
  	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
  	<EditableInput label="N° Teléfono / Celular" value={values?.phone ?? ""} onChange={(v) => onChange("phone", v)} readOnly={readOnly} />
  	<SelectField label="Tipo de Documento" value={values?.docType ?? "DNI"} options={docTypes} onChange={(v) => onChange("docType", v)} disabled={readOnly} />
  	<EditableInput label="N° Documento" value={values?.docNumber ?? ""} onChange={(v) => onChange("docNumber", v)} readOnly={readOnly} />
  	<EditableInput label="Matrícula" value={values?.license ?? ""} onChange={(v) => onChange("license", v)} readOnly={readOnly} />
  	<SelectField label="Condición Fiscal" value={values?.taxStatus ?? ""} options={taxStatuses} onChange={(v) => onChange("taxStatus", v)} disabled={readOnly} />
  	<SelectField label="Especialidad" value={values?.specialty ?? ""} options={specialties} onChange={(v) => onChange("specialty", v)} disabled={readOnly} />
  	<EditableInput label="Nombre de Empresa (Opcional)" value={values?.companyName ?? ""} onChange={(v) => onChange("companyName", v)} readOnly={readOnly} />
  	<div className="md:col-span-2">
    	<RadioGroup label="Estado" name="provider-status" value={values?.status ?? "Activo"} options={["Activo", "Inactivo"]} onChange={(v) => onChange("status", v)} />
  	</div>
	</div>
  );
}

function EditEntityModal({ isOpen, onClose, onSave, draft, setDraft, readOnly = false }) {
  if (!isOpen || !draft) return null;

  const role = (draft?.role ?? "").trim().toLowerCase();
  const isProvider = role === "proveedor";
  const isAdmin = role === "administrador";

  const panelMax = isProvider ? "max-w-[640px]" : "max-w-[500px]";

  const etiquetaRol = {
	proveedor: "proveedor",
	administrador: "administrador",
	ocupante: "ocupante",
	}[role] ?? "usuario";

  const title = readOnly
	? `Datos del ${etiquetaRol}`
	: `Editar ${etiquetaRol}`;

  const updateField = (key, value) => {
	if (readOnly) return;
	setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
	onSave?.(draft);
  };

  return (
	<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
  	<div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

  	<div
    	role="dialog"
    	aria-modal="true"
    	aria-labelledby="edit-entity-title"
    	className={`
      	relative z-10 w-full
      	${panelMax}
      	max-h-[90dvh]
      	overflow-hidden
      	rounded-2xl
      	border border-white/40
      	bg-[#cfd8dc]
      	shadow-[0_20px_60px_rgba(0,0,0,0.35)]
      	flex flex-col
    	`}
  	>
    	{/* Header */}
    	<div className="flex items-center justify-between bg-secondary px-6 py-4 text-white rounded-t-xl">
      	<h2 id="edit-entity-title" className="text-base font-bold">
        	{title}
      	</h2>
      	<button onClick={onClose} className="rounded-md p-1 hover:bg-white/15 transition" aria-label="Cerrar" type="button">
        	<X size={20} />
      	</button>
    	</div>

    	{/* Body */}
    	<div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      	{isProvider ? (
        	<ProviderForm values={draft} onChange={updateField} readOnly={readOnly} />
      	) : isAdmin ? (
        	<AdminForm values={draft} onChange={updateField} readOnly={readOnly} />
      	) : (
        	<UserForm values={draft} onChange={updateField} readOnly={readOnly} />
      	)}
    	</div>

    	{/* Footer */}
    	<div className="flex justify-center gap-6 px-6 py-8 pb-3 pt-3 border-t border-border">
      	{!readOnly && (
        	<button onClick={handleSave} className="bg-primary text-white px-5 py-2 rounded-full" type="button">
          	Guardar
        	</button>
      	)}

      	<button
        	onClick={onClose}
        	type="button"
        	className="
          	rounded-full border border-slate-400 bg-white/70 px-6 py-2.5
          	text-sm font-semibold text-slate-700 shadow-sm
          	hover:bg-white hover:border-slate-500 transition
        	"
      	>
        	{readOnly ? "Cerrar" : "Cancelar"}
      	</button>
    	</div>
  	</div>
	</div>
  );
}

export default EditEntityModal;

