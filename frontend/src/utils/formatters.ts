import type { TaskPriority, TaskStatus } from "../types";

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));

export const relativeDueLabel = (value: string | Date) => {
  const due = new Date(value).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `${diffDays}d left`;
};

export const isOverdue = (deadline: string, status?: TaskStatus) =>
  status !== "Completed" && new Date(deadline).getTime() < Date.now();

export const statusTone: Record<TaskStatus, string> = {
  Todo: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10",
  "In Progress":
    "bg-violet/10 text-violet ring-violet/20 dark:bg-violet/20 dark:text-violet-100 dark:ring-violet/30",
  Completed:
    "bg-mint/10 text-emerald-700 ring-mint/20 dark:bg-mint/20 dark:text-emerald-100 dark:ring-mint/30"
};

export const priorityTone: Record<TaskPriority, string> = {
  Low: "bg-mint/10 text-emerald-700 ring-mint/20 dark:bg-mint/20 dark:text-emerald-100",
  Medium: "bg-saffron/15 text-amber-700 ring-saffron/20 dark:bg-saffron/20 dark:text-amber-100",
  High: "bg-coral/10 text-red-700 ring-coral/20 dark:bg-coral/20 dark:text-red-100"
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const toDateInputValue = (date?: string) => {
  if (!date) return "";
  const parsed = new Date(date);
  parsed.setMinutes(parsed.getMinutes() - parsed.getTimezoneOffset());
  return parsed.toISOString().slice(0, 16);
};

export const fromDateInputValue = (date: string) => new Date(date).toISOString();

