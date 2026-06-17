import { X, ChevronDown } from "lucide-react";
import EditableInput from "../dashboard/fields/EditableInput";
import SelectField from "../dashboard/fields/SelectField";
import RadioGroup from "../dashboard/fields/RadioGroup";

/* ---------- Forms ---------- */
function UserForm({ values, onChange, readOnly, unidadesDisponibles = [] }) {
  return (
	<div className="space-y-5">
	<EditableInput label="Nombre" value={values?.nombre ?? ""} onChange={(v) => onChange("nombre", v)} readOnly={readOnly} />
	<EditableInput label="Apellido" value={values?.apellido ?? ""} onChange={(v) => onChange("apellido", v)} readOnly={readOnly} />
	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
	<EditableInput label="N° Teléfono / Celular" value={values?.telefono ?? ""} onChange={(v) => onChange("telefono", v)} readOnly={readOnly} />
	<SelectField label="Tipo de Documento" value={values?.tipoDoc ?? "DNI"} options={["DNI", "CUIL", "CUIT", "PASAPORTE"]} onChange={(v) => onChange("tipoDoc", v)} disabled={readOnly} />
	<EditableInput label="N° Documento" value={values?.numDoc ?? ""} onChange={(v) => onChange("numDoc", v)} readOnly={readOnly} />

	{/* Select de unidad con datos reales del back */}
	<div className="space-y-2">
  	<label className="text-sm font-medium text-slate-700">Seleccionar Unidad</label>
  	<div className="relative">
    	<select
      	value={values?.unit ?? ""}
      	onChange={(e) => onChange("unit", e.target.value)}
      	disabled={readOnly}
      	className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-900/40 disabled:bg-slate-50"
    	>
      	
		<option value="">Sin unidad asignada</option>
		{unidadesDisponibles.map((u) => {
			const enRefaccion = u.estado === "EN_REFACCION";
			return (
				<option key={u._id} value={u._id} disabled={enRefaccion}>
				Piso {u.piso} - Unidad {u.numero}
				{enRefaccion ? " (en refacción)" : ""}
				</option>
			);
		})}


    	</select>
    	<ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0f5b66]" />
  	</div>
	</div>

	<SelectField label="Rol en la Unidad" value={values?.unitRole ?? "PROPIETARIO"} options={["PROPIETARIO", "INQUILINO"]} onChange={(v) => onChange("unitRole", v)} disabled={readOnly} />
	<RadioGroup label="Estado" name="estado" value={values?.estado ?? "ACTIVO"} options={["ACTIVO", "INACTIVO"]} onChange={(v) => onChange("estado", v)} />
	<RadioGroup label="¿Reside en la unidad?" name="resides" value={values?.resides ?? "Si"} options={["Si", "No"]} onChange={(v) => onChange("resides", v)} />
	</div>
  );
}

function AdminForm({ values, onChange, readOnly }) {
  return (
	<div className="space-y-5">
	<EditableInput label="Nombre" value={values?.nombre ?? ""} onChange={(v) => onChange("nombre", v)} readOnly={readOnly} />
	<EditableInput label="Apellido" value={values?.apellido ?? ""} onChange={(v) => onChange("apellido", v)} readOnly={readOnly} />
	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
	<RadioGroup label="Estado" name="estado-admin" value={values?.estado ?? "ACTIVO"} options={["ACTIVO", "INACTIVO"]} onChange={(v) => onChange("estado", v)} />
	</div>
  );
}

function ProviderForm({ values, onChange, readOnly }) {
  const docTypes = ["DNI", "CUIL", "CUIT", "PASAPORTE"];
  const rubros = ["Plomero", "Electricista", "Ascensores", "Pintor", "Gasista"];
  const taxStatuses = ["Monotributista", "Responsable Inscripto", "Exento", "Consumidor Final"];
  const specialties = ["plomeria", "electricidad", "ascensores", "albanileria", "cerrajeria", "limpieza", "jardineria", "otro"];
  return (
	<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
	<EditableInput label="Nombre" value={values?.nombre ?? ""} onChange={(v) => onChange("nombre", v)} readOnly={readOnly} />
	<EditableInput label="Dirección" value={values?.direccion ?? ""} onChange={(v) => onChange("direccion", v)} readOnly={readOnly} />
	<EditableInput label="Apellido" value={values?.apellido ?? ""} onChange={(v) => onChange("apellido", v)} readOnly={readOnly} />
	<SelectField label="Rubro" value={values?.tipoProveedor ?? ""} options={rubros} onChange={(v) => onChange("tipoProveedor", v)} disabled={readOnly} />
	<EditableInput label="Email" value={values?.email ?? ""} onChange={(v) => onChange("email", v)} readOnly={readOnly} />
	<EditableInput label="N° Teléfono / Celular" value={values?.telefono ?? ""} onChange={(v) => onChange("telefono", v)} readOnly={readOnly} />
	<SelectField label="Tipo de Documento" value={values?.tipoDoc ?? "DNI"} options={docTypes} onChange={(v) => onChange("tipoDoc", v)} disabled={readOnly} />
	<EditableInput label="N° Documento" value={values?.numDoc ?? ""} onChange={(v) => onChange("numDoc", v)} readOnly={readOnly} />
	<EditableInput label="Matrícula" value={values?.matricula ?? ""} onChange={(v) => onChange("matricula", v)} readOnly={readOnly} />
	<SelectField label="Condición Fiscal" value={values?.condicionFiscal ?? ""} options={taxStatuses} onChange={(v) => onChange("condicionFiscal", v)} disabled={readOnly} />
	<SelectField label="Especialidad" value={values?.especialidad ?? ""} options={specialties} onChange={(v) => onChange("especialidad", v)} disabled={readOnly} />
	<EditableInput label="Nombre de Empresa (Opcional)" value={values?.razonSocial ?? ""} onChange={(v) => onChange("razonSocial", v)} readOnly={readOnly} />
	<div className="md:col-span-2">
    	<RadioGroup label="Estado" name="estado-prov" value={values?.estado ?? "ACTIVO"} options={["ACTIVO", "INACTIVO"]} onChange={(v) => onChange("estado", v)} />
	</div>
	</div>
  );
}

function EditEntityModal({ isOpen, onClose, onSave, draft, setDraft, readOnly = false, unidadesDisponibles = [] }) {
  if (!isOpen || !draft) return null;

  const tipo = (draft?.tipo ?? "").trim().toLowerCase();
  const isProvider = tipo === "proveedor";
  const isAdmin = tipo === "administrador";

  const panelMax = isProvider ? "max-w-[640px]" : "max-w-[500px]";

  const etiquetaRol = {
	proveedor: "proveedor",
	administrador: "administrador",
	ocupante: "ocupante",
  }[tipo] ?? "usuario";

  const title = readOnly
	? `Datos del ${etiquetaRol}`
	: `Editar ${etiquetaRol}`;

  // Para proveedor, manejamos campos planos en draft y los aplanamos desde proveedorDetalle al abrir
  // Si el draft tiene proveedorDetalle anidado, lo aplanamos para que los inputs lo encuentren
  const ensureFlat = (current) => {
	if (!current) return current;
	if (current.proveedorDetalle && tipo === "proveedor") {
  	const flat = {
    	...current,
    	...current.proveedorDetalle,
  	};
  	// limpiamos el anidado del draft local (al guardar lo reconstruimos)
  	delete flat.proveedorDetalle;
  	return flat;
	}
	return current;
  };

  const updateField = (key, value) => {
	if (readOnly) return;
	setDraft((prev) => ({ ...ensureFlat(prev), [key]: value }));
  };

  const handleSave = () => {
	// Reconstruir proveedorDetalle si es proveedor
	let payload = { ...draft };
	if (isProvider) {
  	payload.proveedorDetalle = {
    	direccion: draft.direccion ?? "",
    	especialidad: draft.especialidad ?? "",
    	matricula: draft.matricula ?? "",
    	tipoProveedor: draft.tipoProveedor ?? "",
    	condicionFiscal: draft.condicionFiscal ?? "",
    	razonSocial: draft.razonSocial ?? null,
    	cuit_cuil: draft.cuit_cuil ?? null,
  	};
  	// limpiamos los planos del payload para no mandarlos duplicados
  	delete payload.direccion;
  	delete payload.especialidad;
  	delete payload.matricula;
  	delete payload.tipoProveedor;
  	delete payload.condicionFiscal;
  	delete payload.razonSocial;
	}
	onSave?.(payload);
  };

  // Aseguramos que los valores planos estén disponibles al renderizar
  const valuesForRender = ensureFlat(draft);

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
        	<ProviderForm values={valuesForRender} onChange={updateField} readOnly={readOnly} />
    	) : isAdmin ? (
        	<AdminForm values={valuesForRender} onChange={updateField} readOnly={readOnly} />
    	) : (
        	<UserForm values={valuesForRender} onChange={updateField} readOnly={readOnly} unidadesDisponibles={unidadesDisponibles} />
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


