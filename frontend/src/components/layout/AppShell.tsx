import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cloud bg-app-grid bg-[length:32px_32px] text-ink dark:bg-ink dark:text-white">
      <div className="min-h-screen bg-gradient-to-b from-white/60 via-transparent to-white/80 dark:from-white/[0.03] dark:via-transparent dark:to-black/15">
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="min-w-0 flex-1">
            <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
            <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

