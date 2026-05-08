export type Role = "Admin" | "Member";
export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type User = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  assignedProjects?: ProjectSummary[];
  createdAt?: string;
};

export type ProjectSummary = {
  _id: string;
  title: string;
  deadline: string;
};

export type Project = {
  _id: string;
  title: string;
  description: string;
  members: User[];
  tasks: Task[];
  deadline: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: User;
  project: Project | ProjectSummary;
  deadline: string;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  _id: string;
  type: string;
  message: string;
  actor: User;
  project?: ProjectSummary;
  task?: Pick<Task, "_id" | "title" | "status">;
  createdAt: string;
};

export type DashboardAnalytics = {
  stats: {
    totalTasks: number;
    completedTasks: number;
    activeProjects: number;
    overdueTasks: number;
    completionRate: number;
  };
  statusBreakdown: Array<{ name: TaskStatus; value: number }>;
  priorityBreakdown: Array<{ name: TaskPriority; value: number }>;
  completionTrend: Array<{ label: string; completed: number }>;
  projectProgress: Array<{
    id: string;
    title: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
    deadline: string;
  }>;
  workload: Array<{ name: string; assigned: number; completed: number }>;
  overdue: Task[];
  activities: Activity[];
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  details?: Array<{ field: string; message: string }> | string[];
};

