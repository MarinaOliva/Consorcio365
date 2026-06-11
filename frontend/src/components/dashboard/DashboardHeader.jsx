import { Settings, Menu } from "lucide-react";

function DashboardHeader({
  title,
  subtitle,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-20 w-full min-w-0 flex h-[58px] items-center justify-between bg-secondary px-4 text-white shadow-md sm:px-6 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-sm hover:bg-secondarySoft lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={17} strokeWidth={2.2} />
        </button>

        <div className="flex min-w-0 flex-col justify-center">
          <h1 className="tracking-normal text-[16px] my-1 font-bold leading-[1.05] sm:text-[17px]">
            {title}
          </h1>

          {subtitle && (
            <p className="my-0 text-[16px] leading-[1.05] text-white/55 sm:text-[10.5px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="rounded-full p-1.5 text-[25px] leading-none text-white/80 transition hover:bg-secondarySoft hover:text-white"
        aria-label="Configuración"
      >
        <Settings size={18} strokeWidth={2.2} />
      </button>
    </header>
  );
}

export default DashboardHeader;