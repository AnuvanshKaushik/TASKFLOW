import { FolderKanban } from "lucide-react";
import type { DashboardAnalytics } from "../../types";
import { formatDate } from "../../utils/formatters";
import { EmptyState } from "../ui/EmptyState";
import { ProgressBar } from "../ui/ProgressBar";

export const ProjectPulse = ({
  projects
}: {
  projects: DashboardAnalytics["projectProgress"];
}) => {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-6 w-6" />}
        title="No projects mapped"
        description="Create a project to turn this panel into a live delivery radar."
      />
    );
  }

  return (
    <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase text-mint">Project pulse</p>
        <h2 className="text-xl font-black text-ink dark:text-white">Delivery progress</h2>
      </div>
      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <div key={project.id} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink dark:text-white">{project.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {project.completedTasks}/{project.totalTasks} tasks - {formatDate(project.deadline)}
                </p>
              </div>
              <span className="rounded-full bg-mint/10 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-100">
                {project.progress}%
              </span>
            </div>
            <ProgressBar value={project.progress} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

