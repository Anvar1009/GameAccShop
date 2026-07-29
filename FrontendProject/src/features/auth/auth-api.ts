import { api } from "@/lib/api";
import type {
  GoogleAuthRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendCodeRequest,
  VerifyEmailRequest,
} from "@/types/api";

export const authApi = {
  login: (payload: LoginRequest) =>
    api.post<LoginResponse>("/api/Auth/login", payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    api.post<RegisterResponse>("/api/Auth/Registratsiya", payload).then((r) => r.data),

  verifyEmail: (payload: VerifyEmailRequest) =>
    api.post<LoginResponse>("/api/Auth/verify-email", payload).then((r) => r.data),

  resendCode: (payload: ResendCodeRequest) =>
    api.post<{ message: string }>("/api/Auth/resend-code", payload).then((r) => r.data),

  googleAuth: (payload: GoogleAuthRequest) =>
    api.post<LoginResponse>("/api/Auth/google", payload).then((r) => r.data),

  me: () => api.get<string>("/api/Auth/me").then((r) => r.data),
};
