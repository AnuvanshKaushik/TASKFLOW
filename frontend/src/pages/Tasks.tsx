import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ListFilter, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { TaskBoard } from "../components/tasks/TaskBoard";
import { TaskModal } from "../components/tasks/TaskModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";
import { getApiErrorMessage } from "../services/api";
import { projectService } from "../services/projectService";
import { taskService, type TaskPayload, type TaskQuery } from "../services/taskService";
import { userService } from "../services/userService";
import type { Project, Task, TaskPriority, TaskStatus, User } from "../types";

const statuses: Array<TaskStatus | "All"> = ["All", "Todo", "In Progress", "Completed"];
const priorities: Array<TaskPriority | "All"> = ["All", "Low", "Medium", "High"];
const sortOptions = [
  { value: "-createdAt", label: "Newest" },
  { value: "deadline", label: "Deadline soon" },
  { value: "-deadline", label: "Deadline late" },
  { value: "-priority", label: "Priority high" }
];

export const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const { notify } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "All">("All");
  const [priority, setPriority] = useState<TaskPriority | "All">("All");
  const [project, setProject] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const debouncedSearch = useDebounce(search);

  const query: TaskQuery = useMemo(
    () => ({ search: debouncedSearch, status, priority, project, sort }),
    [debouncedSearch, priority, project, sort, status]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [taskData, projectData, userData] = await Promise.all([
        taskService.list(query),
        projectService.list(),
        userService.list()
      ]);
      setTasks(taskData);
      setProjects(projectData);
      setUsers(userData);
    } catch (error) {
      notify({ type: "error", title: "Tasks unavailable", description: getApiErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = async (values: TaskPayload) => {
    try {
      setSaving(true);
      if (editingTask) {
        const updated = await taskService.update(editingTask._id, values);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
        notify({ type: "success", title: "Task updated", description: updated.title });
      } else {
        const created = await taskService.create(values);
        setTasks((current) => [created, ...current]);
        notify({ type: "success", title: "Task assigned", description: created.title });
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      notify({ type: "error", title: "Task save failed", description: getApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task: Task, nextStatus: TaskStatus) => {
    try {
      const updated = await taskService.updateStatus(task._id, nextStatus);
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      notify({ type: "success", title: "Status updated", description: `${task.title} moved to ${nextStatus}.` });
    } catch (error) {
      notify({ type: "error", title: "Status update failed", description: getApiErrorMessage(error) });
    }
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      await taskService.remove(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      notify({ type: "success", title: "Task deleted" });
    } catch (error) {
      notify({ type: "error", title: "Delete failed", description: getApiErrorMessage(error) });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase text-violet">Task management</p>
            <h2 className="mt-1 text-2xl font-black text-ink dark:text-white">
              {tasks.length} visible work items
            </h2>
          </div>
          {isAdmin ? (
            <Button
              type="button"
              disabled={projects.length === 0 || users.length === 0}
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-5 w-5" />
              New task
            </Button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_repeat(4,180px)]">
          <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              className="w-full bg-transparent text-ink outline-none placeholder:text-slate-400 dark:text-white"
            />
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
            <ListFilter className="h-4 w-4 text-slate-400" />
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | "All")} className="w-full bg-transparent font-semibold outline-none dark:text-white">
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority | "All")}
            className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-ink shadow-soft outline-none dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                {item} priority
              </option>
            ))}
          </select>

          <select
            value={project}
            onChange={(event) => setProject(event.target.value)}
            className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-ink shadow-soft outline-none dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
          >
            <option value="">All projects</option>
            {projects.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-ink shadow-soft outline-none dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[520px]" />
          ))}
        </div>
      ) : (
        <TaskBoard
          tasks={tasks}
          currentUser={user}
          canManage={isAdmin}
          onEdit={(task) => {
            setEditingTask(task);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <TaskModal
        open={modalOpen}
        task={editingTask}
        projects={projects}
        users={users}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
};

