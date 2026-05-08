import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, FolderKanban, LayoutDashboard, Settings, Users, X, ClipboardList } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/formatters";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings }
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-aurora-strip shadow-glow">
            <BarChart3 className="h-5 w-5 text-ink dark:text-white" />
          </div>
          <div>
            <p className="text-base font-black text-ink dark:text-white">TaskFlow AI</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Team velocity OS</p>
          </div>
        </NavLink>
        {onClose ? (
          <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      <nav className="mt-3 grid gap-1 px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                isActive
                  ? "bg-ink text-white shadow-soft dark:bg-white dark:text-ink"
                  : "text-slate-600 hover:bg-white hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-[24px] border border-white/50 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">
              {initials(user?.name ?? "TF")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink dark:text-white">{user?.name}</p>
              <p className="text-xs font-semibold text-violet dark:text-violet-200">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({ open, onClose }: SidebarProps) => (
  <>
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/50 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:block">
      <SidebarContent />
    </aside>

    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="h-full w-[min(86vw,20rem)] border-r border-white/50 bg-cloud shadow-glow dark:border-white/10 dark:bg-[#171923]"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </>
);

