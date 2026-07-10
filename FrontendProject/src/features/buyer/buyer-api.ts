import { api } from "@/lib/api";
import type {
  BuyerOrder,
  BuyerOrderDetails,
  OrderResponse,
  PaymentDetails,
  PaymentStatusInfo,
} from "@/types/api";

export const buyerApi = {
  createOrder: (productId: number) =>
    api.post<OrderResponse>("/api/BuyerOrder", { productId }).then((r) => r.data),

  getOrders: () => api.get<BuyerOrder[]>("/api/BuyerOrder").then((r) => r.data),

  getOrderDetails: (orderId: number) =>
    api.get<BuyerOrderDetails>(`/api/BuyerOrder/${orderId}`).then((r) => r.data),

  confirmOrder: (orderId: number) =>
    api.put(`/api/BuyerOrder/confirm/${orderId}`).then((r) => r.data),

  cancelOrder: (orderId: number) =>
    api.put(`/api/BuyerOrder/cancel/${orderId}`).then((r) => r.data),

  getPaymentDetails: (orderId: number) =>
    api.get<PaymentDetails>(`/api/BuyerPayment/${orderId}/details`).then((r) => r.data),

  getPaymentStatus: (orderId: number) =>
    api.get<PaymentStatusInfo>(`/api/BuyerPayment/${orderId}/PaymentStatus`).then((r) => r.data),

  // The service reads PaymentId from the form body; the route {orderId} is
  // required for routing but ignored by the handler.
  uploadReceipt: (orderId: number, paymentId: number, receipt: File) => {
    const fd = new FormData();
    fd.append("PaymentId", String(paymentId));
    fd.append("Receipt", receipt);
    return api.put(`/api/BuyerPayment/${orderId}/UploadReceipt`, fd).then((r) => r.data);
  },
};
