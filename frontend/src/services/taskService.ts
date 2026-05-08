import { api } from "./api";
import type { Task, TaskPriority, TaskStatus } from "../types";

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  assignedTo: string;
  project: string;
};

export type TaskQuery = {
  search?: string;
  status?: TaskStatus | "All";
  priority?: TaskPriority | "All";
  project?: string;
  sort?: string;
};

export const taskService = {
  async list(query?: TaskQuery) {
    const { data } = await api.get<{ success: true; tasks: Task[] }>("/tasks", {
      params: {
        search: query?.search || undefined,
        status: query?.status && query.status !== "All" ? query.status : undefined,
        priority: query?.priority && query.priority !== "All" ? query.priority : undefined,
        project: query?.project || undefined,
        sort: query?.sort || undefined
      }
    });
    return data.tasks;
  },
  async create(payload: TaskPayload) {
    const { data } = await api.post<{ success: true; task: Task }>("/tasks", payload);
    return data.task;
  },
  async update(id: string, payload: Partial<TaskPayload>) {
    const { data } = await api.patch<{ success: true; task: Task }>(`/tasks/${id}`, payload);
    return data.task;
  },
  async updateStatus(id: string, status: TaskStatus) {
    const { data } = await api.patch<{ success: true; task: Task }>(`/tasks/${id}/status`, { status });
    return data.task;
  },
  async remove(id: string) {
    await api.delete(`/tasks/${id}`);
  }
};

