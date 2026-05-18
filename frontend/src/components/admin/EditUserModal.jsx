import { X } from "lucide-react";

function EditUserModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[520px] rounded-2xl bg-surface shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-secondary px-5 py-3 text-white">
          <h2 className="text-sm font-semibold">
            Detalles de Usuario
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          
          <div>
            <label className="text-xs text-textMuted">
              Nombre
            </label>

            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              defaultValue={user?.name}
            />
          </div>

          <div>
            <label className="text-xs text-textMuted">
              Email
            </label>

            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              defaultValue={user?.email}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            className="rounded-lg border border-red-400 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="rounded-lg bg-primary px-5 py-2 text-sm text-white shadow-md hover:bg-primaryHover transition"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditUserModal;