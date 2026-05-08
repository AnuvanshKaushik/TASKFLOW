import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Project, Task, TaskPriority, TaskStatus, User } from "../../types";
import { fromDateInputValue, toDateInputValue } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";

type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  assignedTo: string;
  project: string;
};

type TaskModalProps = {
  open: boolean;
  task?: Task | null;
  projects: Project[];
  users: User[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues & { deadline: string }) => Promise<void>;
};

const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const getProjectId = (task?: Task | null) => {
  if (!task) return "";
  return typeof task.project === "string" ? task.project : task.project?._id;
};

export const TaskModal = ({ open, task, projects, users, loading, onClose, onSubmit }: TaskModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      deadline: defaultDeadline(),
      assignedTo: "",
      project: ""
    }
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: toDateInputValue(task.deadline),
        assignedTo: task.assignedTo?._id ?? "",
        project: getProjectId(task)
      });
      return;
    }

    reset({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      deadline: defaultDeadline(),
      assignedTo: users[0]?._id ?? "",
      project: projects[0]?._id ?? ""
    });
  }, [open, projects, reset, task, users]);

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
      title={task ? "Tune task" : "Assign task"}
      description="Connect the work item to a project, owner, priority, and delivery date."
    >
      <form className="grid gap-5" onSubmit={submit}>
        <Input
          label="Task title"
          placeholder="Prepare release readiness deck"
          error={errors.title?.message}
          {...register("title", { required: "Task title is required", minLength: { value: 3, message: "Use at least 3 characters" } })}
        />
        <Textarea
          label="Description"
          placeholder="Define the expected output and any acceptance details."
          error={errors.description?.message}
          {...register("description", {
            required: "Description is required",
            minLength: { value: 8, message: "Use at least 8 characters" }
          })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Project" error={errors.project?.message} {...register("project", { required: "Project is required" })}>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </Select>
          <Select
            label="Assigned member"
            error={errors.assignedTo?.message}
            {...register("assignedTo", { required: "Assignee is required" })}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="Status" {...register("status")}>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <Select label="Priority" {...register("priority")}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Input label="Deadline" type="datetime-local" error={errors.deadline?.message} {...register("deadline", { required: "Deadline is required" })} />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {task ? "Save task" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

