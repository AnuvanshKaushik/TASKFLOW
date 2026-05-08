import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import type { Activity } from "../../types";
import { formatDate, initials } from "../../utils/formatters";
import { EmptyState } from "../ui/EmptyState";

export const ActivityTimeline = ({ activities }: { activities: Activity[] }) => {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={<Clock3 className="h-6 w-6" />}
        title="No activity yet"
        description="Project updates, assignments, and completions will collect here as the team starts moving."
      />
    );
  }

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-violet">Timeline</p>
          <h2 className="text-xl font-black text-ink dark:text-white">Recent activity</h2>
        </div>
        <Clock3 className="h-5 w-5 text-slate-400" />
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.05]"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-ink text-xs font-black text-white dark:bg-white dark:text-ink">
              {initials(activity.actor?.name ?? "AI")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-white">{activity.message}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {formatDate(activity.createdAt)}
                {activity.project?.title ? ` - ${activity.project.title}` : ""}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

