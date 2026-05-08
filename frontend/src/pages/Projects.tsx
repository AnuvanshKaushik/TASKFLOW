import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../services/api";
import { projectService, type ProjectPayload } from "../services/projectService";
import { userService } from "../services/userService";
import type { Project, User } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectModal } from "../components/projects/ProjectModal";

export const Projects = () => {
  const { isAdmin } = useAuth();
  const { notify } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const debouncedSearch = useDebounce(search);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [projectData, userData] = await Promise.all([
        projectService.list(debouncedSearch),
        userService.list()
      ]);
      setProjects(projectData);
      setUsers(userData);
    } catch (error) {
      notify({ type: "error", title: "Projects unavailable", description: getApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const openCreateModal = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values: ProjectPayload) => {
    try {
      setSaving(true);
      if (editingProject) {
        const updated = await projectService.update(editingProject._id, values);
        setProjects((current) => current.map((project) => (project._id === updated._id ? updated : project)));
        notify({ type: "success", title: "Project updated", description: `${updated.title} is refreshed.` });
      } else {
        const created = await projectService.create(values);
        setProjects((current) => [created, ...current]);
        notify({ type: "success", title: "Project created", description: `${created.title} is live.` });
      }
      setModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      notify({ type: "error", title: "Project save failed", description: getApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`Delete "${project.title}" and all of its tasks?`);
    if (!confirmed) return;

    try {
      await projectService.remove(project._id);
      setProjects((current) => current.filter((item) => item._id !== project._id));
      notify({ type: "success", title: "Project deleted" });
    } catch (error) {
      notify({ type: "error", title: "Delete failed", description: getApiErrorMessage(error) });
    }
  };

  const projectCount = useMemo(() => projects.length, [projects]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <section className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase text-violet">Project management</p>
          <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">
            {projectCount} active {projectCount === 1 ? "project" : "projects"}
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
              className="w-full bg-transparent text-ink outline-none placeholder:text-slate-400 dark:text-white"
            />
          </label>
          {isAdmin ? (
            <Button type="button" onClick={openCreateModal}>
              <FolderPlus className="h-5 w-5" />
              New project
            </Button>
          ) : null}
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              canManage={isAdmin}
              onEdit={(selected) => {
                setEditingProject(selected);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<FolderPlus className="h-6 w-6" />}
          title="No projects found"
          description="Create a project with a clear deadline, team, and scope to begin."
          action={
            isAdmin ? (
              <Button type="button" onClick={openCreateModal}>
                <FolderPlus className="h-5 w-5" />
                Create project
              </Button>
            ) : null
          }
        />
      )}

      <ProjectModal
        open={modalOpen}
        project={editingProject}
        users={users}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

