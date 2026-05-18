import { NavLink } from "react-router-dom";

function SidebarItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 rounded-md px-4 py-1.5
        text-[12px] font-semibold transition
        ${isActive
          ? "bg-secondarySoft text-white"
          : "text-white/90 hover:bg-secondarySoft hover:text-white"
        }
      `}
    >
      <span className="flex w-4 shrink-0 justify-center">
        {Icon && (
          <Icon
            size={15}
            strokeWidth={2}
            className="text-current"
          />
        )}
      </span>

      <span className="leading-none">
        {item.label}
      </span>
    </NavLink>
  );
}

export default SidebarItem;
