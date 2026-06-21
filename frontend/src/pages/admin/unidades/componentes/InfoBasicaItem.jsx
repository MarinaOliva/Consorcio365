function InfoBasicaItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-textMuted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-textMain">{value}</p>
    </div>
  );
}

export default InfoBasicaItem;