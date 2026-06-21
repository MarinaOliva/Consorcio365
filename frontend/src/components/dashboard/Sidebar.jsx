import SidebarItem from "./SidebarItem";
import UserPanel from "./UserPanel";
import LogoutButton from "./LogoutButton";
import { Building2 } from "lucide-react";

function Sidebar({
  menuItems = [],
  user,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-[220px] flex-col
          bg-secondary text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-12 shrink-0 items-center gap-3 px-5">
          
          <Building2
            size={20}
            strokeWidth={2.3}
            className="text-emerald-300"
          />

          <span className="text-base font-bold leading-none text-emerald-300">
            Consorcio365
          </span>
        </div>

        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="shrink-0">
          <UserPanel user={user} />

          <div className="px-5 py-5">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;