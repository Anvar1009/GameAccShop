import { api } from "@/lib/api";
import type {
  AdminOrder,
  AdminOrderDetails,
  AdminPayment,
  AdminPaymentDetails,
  AdminStats,
  PaymentAccount,
  PaymentAccountRequest,
} from "@/types/api";

export const adminApi = {
  // Stats
  getStats: () => api.get<AdminStats>("/api/AdminStats").then((r) => r.data),

  // Payments
  getPayments: () => api.get<AdminPayment[]>("/api/AdminPayment").then((r) => r.data),

  getPaymentDetails: (id: number) =>
    api.get<AdminPaymentDetails>(`/api/AdminPayment/${id}`).then((r) => r.data),

  // NOTE: backend route is intentionally misspelled "confrim".
  confirmPayment: (id: number) => api.put(`/api/AdminPayment/${id}/confrim`).then((r) => r.data),

  releasePayment: (id: number) => api.put(`/api/AdminPayment/${id}/released`).then((r) => r.data),

  // Orders
  getOrders: () => api.get<AdminOrder[]>("/api/AdminOrder").then((r) => r.data),

  getOrderDetails: (orderId: number) =>
    api.get<AdminOrderDetails>(`/api/AdminOrder/${orderId}`).then((r) => r.data),

  // Payment accounts (the cards buyers pay into)
  getActivePaymentAccount: () =>
    api.get<PaymentAccount>("/api/PaymentAccount").then((r) => r.data),

  getPaymentAccount: (id: number) =>
    api.get<PaymentAccount>(`/api/PaymentAccount/${id}`).then((r) => r.data),

  createPaymentAccount: (payload: PaymentAccountRequest) =>
    api.post("/api/PaymentAccount", payload).then((r) => r.data),

  updatePaymentAccount: (id: number, payload: PaymentAccountRequest) =>
    api.put(`/api/PaymentAccount/${id}`, payload).then((r) => r.data),

  deletePaymentAccount: (id: number) =>
    api.delete(`/api/PaymentAccount/${id}`).then((r) => r.data),
};
