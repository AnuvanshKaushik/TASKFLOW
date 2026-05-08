import { api } from "./api";
import type { DashboardAnalytics } from "../types";

export const analyticsService = {
  async dashboard() {
    const { data } = await api.get<{ success: true; analytics: DashboardAnalytics }>(
      "/analytics/dashboard"
    );
    return data.analytics;
  }
};

