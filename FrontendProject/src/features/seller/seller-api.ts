import { api } from "@/lib/api";
import type { Product, SellerOrder, SellerOrderDetails } from "@/types/api";

export interface ProductFormValues {
  accStrength: number;
  playerCount: number;
  coinsCount: number;
  accPrice: number;
  description: string;
  accEmail: string;
  accPassword: string;
  tags: string[];
  medias: File[];
}

function toFormData(values: ProductFormValues, extra?: Record<string, string | number>) {
  const fd = new FormData();
  fd.append("AccStrength", String(values.accStrength));
  fd.append("PlayerCount", String(values.playerCount));
  fd.append("CoinsCount", String(values.coinsCount));
  fd.append("AccPrice", String(values.accPrice));
  fd.append("Description", values.description ?? "");
  fd.append("AccEmail", values.accEmail);
  fd.append("AccPassword", values.accPassword);
  values.tags.forEach((tag) => fd.append("Tags", tag));
  values.medias.forEach((file) => fd.append("Medias", file));
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => fd.append(k, String(v)));
  }
  return fd;
}

export const sellerApi = {
  getMyProducts: () => api.get<Product[]>("/api/SellerProduct").then((r) => r.data),

  getProductDetails: (productId: number) =>
    api.get<Product>(`/api/SellerProduct/details/${productId}`).then((r) => r.data),

  create: (values: ProductFormValues) =>
    api.post<Product>("/api/SellerProduct", toFormData(values)).then((r) => r.data),

  // The backend UpdateProductDTO carries Id + SellerId and requires media, so we
  // send multipart form-data (IFormFile fields force [FromForm] binding).
  update: (id: number, sellerId: number, values: ProductFormValues) =>
    api
      .put<Product>("/api/SellerProduct/update", toFormData(values, { Id: id, SellerId: sellerId }))
      .then((r) => r.data),

  remove: (id: number) =>
    api.delete<number>("/api/SellerProduct/delete", { params: { id } }).then((r) => r.data),

  getOrders: () => api.get<SellerOrder[]>("/api/SellerOrder").then((r) => r.data),

  getOrderDetails: (orderId: number) =>
    api.get<SellerOrderDetails>(`/api/SellerOrder/${orderId}`).then((r) => r.data),
};
