import { motion } from "framer-motion";
import { CalendarClock, Edit3, Trash2, UserRound } from "lucide-react";
import type { Task, TaskStatus } from "../../types";
import { cn } from "../../utils/cn";
import { formatDate, isOverdue, priorityTone, statusTone } from "../../utils/formatters";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type TaskCardProps = {
  task: Task;
  canManage: boolean;
  canChangeStatus: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  Todo: "In Progress",
  "In Progress": "Completed",
  Completed: "Todo"
};

export const TaskCard = ({
  task,
  canManage,
  canChangeStatus,
  onEdit,
  onDelete,
  onStatusChange
}: TaskCardProps) => {
  const overdue = isOverdue(task.deadline, task.status);
  const projectTitle = typeof task.project === "string" ? "Project" : task.project?.title;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={cn(
        "rounded-[24px] border bg-white/80 p-4 shadow-soft backdrop-blur transition dark:bg-white/[0.06]",
        overdue ? "border-coral/30 ring-2 ring-coral/10" : "border-white/70 dark:border-white/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-slate-400">{projectTitle}</p>
          <h3 className="mt-1 line-clamp-2 text-base font-black text-ink dark:text-white">{task.title}</h3>
        </div>
        <Badge className={priorityTone[task.priority]}>{task.priority}</Badge>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={statusTone[task.status]}>{task.status}</Badge>
        {overdue ? <Badge className="bg-coral/10 text-red-600 ring-coral/20">Overdue</Badge> : null}
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          {task.assignedTo?.name ?? "Unassigned"}
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          {formatDate(task.deadline)}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        {canChangeStatus ? (
          <Button type="button" variant="secondary" size="sm" onClick={() => onStatusChange(task, nextStatus[task.status])}>
            Move to {nextStatus[task.status]}
          </Button>
        ) : (
          <span />
        )}
        {canManage ? (
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(task)} aria-label="Delete task">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
};

