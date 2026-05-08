import { ClipboardList } from "lucide-react";
import type { Task, TaskStatus, User } from "../../types";
import { EmptyState } from "../ui/EmptyState";
import { TaskCard } from "./TaskCard";

const columns: TaskStatus[] = ["Todo", "In Progress", "Completed"];

type TaskBoardProps = {
  tasks: Task[];
  currentUser: User | null;
  canManage: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export const TaskBoard = ({ tasks, currentUser, canManage, onEdit, onDelete, onStatusChange }: TaskBoardProps) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-6 w-6" />}
        title="No tasks match this view"
        description="Adjust filters or create a task to start shaping the board."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section
            key={status}
            className="min-h-[420px] rounded-[28px] border border-white/60 bg-white/50 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase text-slate-500 dark:text-slate-300">{status}</h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-300">
                {columnTasks.length}
              </span>
            </div>
            <div className="grid gap-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  canManage={canManage}
                  canChangeStatus={canManage || task.assignedTo?._id === currentUser?._id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

