import { X } from "lucide-react";

function EditEntityModal({
  isOpen,
  onClose,
  onSave,
  entity, // usuario seleccionado
}) {
  if (!isOpen || !entity) return null;

  const isProvider = entity.role === "Proveedor";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      
      <div
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div className="
        relative z-10
        w-full max-w-[720px]
        max-h-[90dvh]
        flex flex-col
        bg-slate-200
        rounded-xl
        border border-secondary/30
        shadow-[0_20px_45px_rgba(7,40,48,0.45)]
      ">

        {/* Header */}
        <div className="flex items-center justify-between bg-secondary px-6 py-4 text-white rounded-t-xl">
          <h2 className="text-base font-bold">
            {isProvider ? "Detalles del proveedor" : "Detalles de usuario"}
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isProvider ? (
            <ProviderForm entity={entity} />
          ) : (
            <UserForm entity={entity} />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 px-6 py-4 border-t border-border">
          <button
            onClick={onSave}
            className="bg-primary text-white px-5 py-2 rounded-md"
          >
            Guardar
          </button>

          <button
            onClick={onClose}
            className="border border-red-400 text-red-500 px-5 py-2 rounded-md"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
function UserForm({ entity }) {
  return (
    <div className="space-y-4">
      <input defaultValue={entity.name} className="input" />
      <input defaultValue={entity.email} className="input" />
      <input defaultValue="DNI" className="input" />
    </div>
  );
}

function ProviderForm({ }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <input placeholder="Nombre" className="input" />
      <input placeholder="Dirección" className="input" />
      <input placeholder="Apellido" className="input" />
      <select className="input">
        <option>Plomero</option>
      </select>
    </div>
  );
}

export default EditEntityModal;