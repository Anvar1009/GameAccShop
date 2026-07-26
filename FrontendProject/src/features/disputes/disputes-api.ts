import { api } from "@/lib/api";
import type { Dispute, DisputeListItem } from "@/types/api";

export interface OpenDisputeRequest {
  orderId: number;
  reason: string;
}

export interface ResolveDisputeRequest {
  adminComment?: string;
}

export const disputesApi = {
  open: (payload: OpenDisputeRequest) =>
    api.post<Dispute>("/api/Dispute", payload).then((r) => r.data),

  getMine: () => api.get<DisputeListItem[]>("/api/Dispute/my").then((r) => r.data),

  getById: (id: number) => api.get<Dispute>(`/api/Dispute/${id}`).then((r) => r.data),

  // Admin
  getAll: () => api.get<DisputeListItem[]>("/api/Dispute").then((r) => r.data),

  startReview: (id: number) => api.put(`/api/Dispute/${id}/review`).then((r) => r.data),

  requestEvidence: (id: number) =>
    api.put(`/api/Dispute/${id}/waiting-evidence`).then((r) => r.data),

  resolveBuyer: (id: number, payload: ResolveDisputeRequest) =>
    api.put(`/api/Dispute/${id}/resolve-buyer`, payload).then((r) => r.data),

  resolveSeller: (id: number, payload: ResolveDisputeRequest) =>
    api.put(`/api/Dispute/${id}/resolve-seller`, payload).then((r) => r.data),

  close: (id: number) => api.put(`/api/Dispute/${id}/close`).then((r) => r.data),

  uploadEvidence: (id: number, files: File[]) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("Files", file));
    return api.post<Dispute>(`/api/Dispute/${id}/evidence`, fd).then((r) => r.data);
  },
};
