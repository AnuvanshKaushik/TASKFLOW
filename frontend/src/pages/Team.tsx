import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../services/api";
import { userService } from "../services/userService";
import type { Role, User } from "../types";
import { initials } from "../utils/formatters";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";

export const Team = () => {
  const { user, isAdmin } = useAuth();
  const { notify } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setUsers(await userService.list());
      } catch (error) {
        notify({ type: "error", title: "Team unavailable", description: getApiErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [notify]);

  const updateRole = async (targetUser: User, role: Role) => {
    try {
      const updated = await userService.updateRole(targetUser._id, role);
      setUsers((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      notify({ type: "success", title: "Role updated", description: `${updated.name} is now ${updated.role}.` });
    } catch (error) {
      notify({ type: "error", title: "Role update failed", description: getApiErrorMessage(error) });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <p className="text-xs font-black uppercase text-violet">Team access</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black text-ink dark:text-white">Workspace members</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Admins can tune roles. Project membership is handled inside each project card.
            </p>
          </div>
          <Badge className="bg-violet/10 text-violet ring-violet/20 dark:bg-violet/20 dark:text-violet-100">
            {user?.role} view
          </Badge>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<UserPlus className="h-6 w-6" />}
          title="No team members yet"
          description="Registered users will appear here once they join the workspace."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {users.map((member, index) => (
            <motion.article
              key={member._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-sm font-black text-white dark:bg-white dark:text-ink">
                    {initials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-ink dark:text-white">{member.name}</h3>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                  </div>
                </div>
                <UsersRound className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/[0.05]">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Role</p>
                  <p className="mt-1 font-black text-ink dark:text-white">{member.role}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/[0.05]">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Projects</p>
                  <p className="mt-1 font-black text-ink dark:text-white">
                    {member.assignedProjects?.length ?? 0}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <div className="mt-5 flex items-center gap-3">
                  <Shield className="h-4 w-4 text-violet" />
                  <select
                    value={member.role}
                    disabled={member._id === user?._id}
                    onChange={(event) => updateRole(member, event.target.value as Role)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-ink outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
};

