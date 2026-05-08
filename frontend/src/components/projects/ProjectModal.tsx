import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Project, User } from "../../types";
import { fromDateInputValue, toDateInputValue } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { Modal } from "../ui/Modal";

type ProjectFormValues = {
  title: string;
  description: string;
  deadline: string;
  members: string[];
};

type ProjectModalProps = {
  open: boolean;
  project?: Project | null;
  users: User[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: { title: string; description: string; deadline: string; members: string[] }) => Promise<void>;
};

const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export const ProjectModal = ({ open, project, users, loading, onClose, onSubmit }: ProjectModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      deadline: defaultDeadline(),
      members: []
    }
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        deadline: toDateInputValue(project.deadline),
        members: project.members?.map((member) => member._id) ?? []
      });
    } else {
      reset({
        title: "",
        description: "",
        deadline: defaultDeadline(),
        members: []
      });
    }
  }, [project, reset, open]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      deadline: fromDateInputValue(values.deadline)
    });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Refine project" : "Create project"}
      description="Shape scope, deadline, and the crew responsible for delivery."
    >
      <form className="grid gap-5" onSubmit={submit}>
        <Input
          label="Project title"
          placeholder="Nimbus rollout"
          error={errors.title?.message}
          {...register("title", { required: "Project title is required", minLength: { value: 3, message: "Use at least 3 characters" } })}
        />
        <Textarea
          label="Description"
          placeholder="Describe the outcome, constraints, and handoff expectations."
          error={errors.description?.message}
          {...register("description", {
            required: "Description is required",
            minLength: { value: 8, message: "Use at least 8 characters" }
          })}
        />
        <Input
          label="Deadline"
          type="datetime-local"
          error={errors.deadline?.message}
          {...register("deadline", { required: "Deadline is required" })}
        />

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Team members</p>
          <div className="grid max-h-56 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-2">
            {users.map((user) => (
              <label
                key={user._id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white dark:hover:bg-white/10"
              >
                <input
                  type="checkbox"
                  value={user._id}
                  className="h-4 w-4 rounded border-slate-300 text-violet focus:ring-violet"
                  {...register("members")}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink dark:text-white">{user.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{user.role}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {project ? "Save project" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

