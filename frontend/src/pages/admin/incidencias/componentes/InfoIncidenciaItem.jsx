function InfoIncidenciaItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[10px] font-bold uppercase text-textMuted">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold leading-snug text-textMain">
        {value}
      </p>
    </div>
  );
}

export default InfoIncidenciaItem;