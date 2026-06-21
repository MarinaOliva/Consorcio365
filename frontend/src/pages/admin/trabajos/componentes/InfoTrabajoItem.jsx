function InfoTrabajoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[10px] font-bold uppercase text-textMuted">
        {label}
      </p>

      <p className="mt-0.5 break-words text-xs font-bold leading-snug text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default InfoTrabajoItem;