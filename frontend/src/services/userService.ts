import { api } from "./api";
import type { Role, User } from "../types";

export const userService = {
  async list() {
    const { data } = await api.get<{ success: true; users: User[] }>("/users");
    return data.users;
  },
  async updateProfile(name: string) {
    const { data } = await api.patch<{ success: true; user: User }>("/users/me", { name });
    return data.user;
  },
  async updateRole(id: string, role: Role) {
    const { data } = await api.patch<{ success: true; user: User }>(`/users/${id}/role`, { role });
    return data.user;
  }
};

