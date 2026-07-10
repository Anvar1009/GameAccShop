import { api } from "@/lib/api";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/api";

export const authApi = {
  login: (payload: LoginRequest) =>
    api.post<LoginResponse>("/api/Auth/login", payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    api.post<RegisterResponse>("/api/Auth/Registratsiya", payload).then((r) => r.data),

  me: () => api.get<string>("/api/Auth/me").then((r) => r.data),
};
