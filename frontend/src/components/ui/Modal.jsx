function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    /* OVERLAY */
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
      onClick={() => onClose && onClose()}
    >
      {/* CONTENEDOR DEL MODAL */}
      <div
        className="
          w-full max-w-md
          max-h-[90vh]
          overflow-y-auto
          bg-surface/90
          backdrop-blur-md
          rounded-2xl
          shadow-glass
          border border-white/40
          p-4
          pl-4
          py-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;