import { api } from "./api";
import type { Project } from "../types";

export type ProjectPayload = {
  title: string;
  description: string;
  deadline: string;
  members: string[];
};

export const projectService = {
  async list(search?: string) {
    const { data } = await api.get<{ success: true; projects: Project[] }>("/projects", {
      params: { search: search || undefined }
    });
    return data.projects;
  },
  async create(payload: ProjectPayload) {
    const { data } = await api.post<{ success: true; project: Project }>("/projects", payload);
    return data.project;
  },
  async update(id: string, payload: Partial<ProjectPayload>) {
    const { data } = await api.patch<{ success: true; project: Project }>(`/projects/${id}`, payload);
    return data.project;
  },
  async remove(id: string) {
    await api.delete(`/projects/${id}`);
  },
  async addMember(id: string, memberId: string) {
    const { data } = await api.post<{ success: true; project: Project }>(`/projects/${id}/members`, {
      memberId
    });
    return data.project;
  },
  async removeMember(id: string, memberId: string) {
    const { data } = await api.delete<{ success: true; project: Project }>(`/projects/${id}/members`, {
      data: { memberId }
    });
    return data.project;
  }
};

