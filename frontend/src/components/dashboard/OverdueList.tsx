import { AlertTriangle } from "lucide-react";
import type { Task } from "../../types";
import { priorityTone, relativeDueLabel } from "../../utils/formatters";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

export const OverdueList = ({ tasks }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title="No overdue tasks"
        description="The board is clear. Keep the momentum tight and deadlines visible."
      />
    );
  }

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase text-coral">Needs attention</p>
        <h2 className="text-xl font-black text-ink dark:text-white">Overdue tasks</h2>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task._id} className="rounded-2xl border border-red-100 bg-red-50/70 p-4 dark:border-red-500/10 dark:bg-red-500/10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink dark:text-white">{task.title}</p>
                <p className="mt-1 text-xs text-red-500">{relativeDueLabel(task.deadline)}</p>
              </div>
              <Badge className={priorityTone[task.priority]}>{task.priority}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

