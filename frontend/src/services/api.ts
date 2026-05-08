import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.details;
    if (Array.isArray(details) && details.length > 0) {
      const first = details[0];
      return typeof first === "string" ? first : first.message;
    }

    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

