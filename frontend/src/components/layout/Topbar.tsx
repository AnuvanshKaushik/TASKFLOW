import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { initials } from "../../utils/formatters";

const titles: Record<string, string> = {
  "/": "Command center",
  "/projects": "Project constellations",
  "/tasks": "Task board",
  "/team": "Team atlas",
  "/settings": "Workspace settings"
};

export const Topbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const title = useMemo(() => titles[pathname] ?? "TaskFlow AI", [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-cloud/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink/80 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-slate-400">TaskFlow AI</p>
          <h1 className="truncate text-xl font-black text-ink dark:text-white sm:text-2xl">{title}</h1>
        </div>

        <div className="hidden min-w-64 items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-slate-500 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          <span>Search tasks, projects, people</span>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
            aria-label="Open profile menu"
          >
            {initials(user?.name ?? "TF")}
          </button>

          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-14 w-64 rounded-[24px] border border-white/50 bg-white/95 p-3 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-[#171923]"
              >
                <div className="border-b border-slate-200 px-2 pb-3 dark:border-white/10">
                  <p className="truncate text-sm font-bold text-ink dark:text-white">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <UserRound className="h-4 w-4" />
                  Profile settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

