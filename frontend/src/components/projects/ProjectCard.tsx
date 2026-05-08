import { motion } from "framer-motion";
import { CalendarDays, Edit3, MoreHorizontal, Trash2, Users } from "lucide-react";
import type { Project } from "../../types";
import { formatDate, initials } from "../../utils/formatters";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";

type ProjectCardProps = {
  project: Project;
  canManage: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export const ProjectCard = ({ project, canManage, onEdit, onDelete }: ProjectCardProps) => {
  const totalTasks = project.tasks?.length ?? 0;
  const completedTasks = project.tasks?.filter((task) => task.status === "Completed").length ?? 0;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl transition dark:border-white/10 dark:bg-white/[0.06]"
    >
      <div className="absolute right-0 top-0 h-24 w-32 bg-aurora-strip opacity-70 [clip-path:polygon(25%_0,100%_0,100%_100%,0_45%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-violet">Project</p>
            <h3 className="mt-1 line-clamp-2 text-xl font-black text-ink dark:text-white">
              {project.title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canManage ? (
              <>
                <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(project)} aria-label="Edit project">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(project)} aria-label="Delete project">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            ) : (
              <MoreHorizontal className="h-5 w-5 text-slate-400" />
            )}
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {project.description}
        </p>

        <div className="mt-5 rounded-2xl bg-white/75 p-4 dark:bg-white/[0.05]">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-ink dark:text-white">{progress}% complete</span>
            <span className="text-slate-500 dark:text-slate-400">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <ProgressBar value={progress} className="mt-3" />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {formatDate(project.deadline)}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            {project.members?.length ?? 0}
          </div>
        </div>

        <div className="mt-5 flex -space-x-2">
          {project.members?.slice(0, 5).map((member) => (
            <div
              key={member._id}
              title={member.name}
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-ink text-xs font-black text-white dark:border-[#171923] dark:bg-white dark:text-ink"
            >
              {initials(member.name)}
            </div>
          ))}
          {project.members?.length > 5 ? (
            <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-slate-100 text-xs font-black text-slate-600 dark:border-[#171923] dark:bg-white/10 dark:text-white">
              +{project.members.length - 5}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
};

