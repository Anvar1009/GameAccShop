import { api } from "@/lib/api";
import type { Product } from "@/types/api";

export const productsApi = {
  getAll: () => api.get<Product[]>("/api/Product/all").then((r) => r.data),

  getById: (id: number) => api.get<Product>(`/api/Product/${id}`).then((r) => r.data),
};
