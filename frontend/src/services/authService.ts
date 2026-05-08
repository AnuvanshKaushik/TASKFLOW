import { api } from "./api";
import type { Role, User } from "../types";

type AuthResponse = {
  success: true;
  token: string;
  user: User;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

const loginEndpointByRole: Record<Role, string> = {
  Admin: "/auth/admin-login",
  Member: "/auth/member-login"
};

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },
  async login(payload: LoginPayload, role?: Role) {
    const endpoint = role ? loginEndpointByRole[role] : "/auth/login";
    const { data } = await api.post<AuthResponse>(endpoint, payload);
    return data;
  },
  async me() {
    const { data } = await api.get<{ success: true; user: User }>("/auth/me");
    return data.user;
  },
  async logout() {
    await api.post("/auth/logout");
  }
};
