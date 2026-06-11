function UserPanel({ user }) {
  return (
    <div className="bg-primary/50 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-emerald-300 bg-surfaceSoft text-primary">
          ●
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">
            {user?.name}
          </p>
          <p className="text-[10px] text-white/60">
            {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
