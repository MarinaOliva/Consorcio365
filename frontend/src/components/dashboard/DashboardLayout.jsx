import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

function DashboardLayout({
  children,
  menuItems = [],
  user,
  title = "Panel general",
  subtitle = "",
  onSettingsClick,
  showSettingsButton = true

}) {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surfaceSoft lg:flex">
      <Sidebar
        menuItems={menuItems}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1 lg:pl-[220px] flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setIsSidebarOpen(true)}
          onSettingsClick={onSettingsClick}
          showSettingsButton={showSettingsButton}

        />

        <main className="w-full px-4 py-4 sm:px-5 lg:px-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
