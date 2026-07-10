import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { translate } from "@/i18n/translations";
import { productKeys } from "@/features/products/products-hooks";
import { buyerApi } from "./buyer-api";

export const buyerKeys = {
  orders: ["buyer", "orders"] as const,
  orderDetail: (id: number) => ["buyer", "orders", id] as const,
  paymentDetail: (orderId: number) => ["buyer", "payment", orderId] as const,
  paymentStatus: (orderId: number) => ["buyer", "payment-status", orderId] as const,
};

export function useBuyerOrders() {
  return useQuery({ queryKey: buyerKeys.orders, queryFn: buyerApi.getOrders });
}

export function useBuyerOrderDetails(orderId: number) {
  return useQuery({
    queryKey: buyerKeys.orderDetail(orderId),
    queryFn: () => buyerApi.getOrderDetails(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });
}

export function usePaymentDetails(orderId: number) {
  return useQuery({
    queryKey: buyerKeys.paymentDetail(orderId),
    queryFn: () => buyerApi.getPaymentDetails(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => buyerApi.createOrder(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: buyerKeys.orders });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.orderPlaceError"))),
  });
}

export function useUploadReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { orderId: number; paymentId: number; receipt: File }) =>
      buyerApi.uploadReceipt(args.orderId, args.paymentId, args.receipt),
    onSuccess: (_data, args) => {
      qc.invalidateQueries({ queryKey: buyerKeys.paymentDetail(args.orderId) });
      qc.invalidateQueries({ queryKey: buyerKeys.orderDetail(args.orderId) });
      qc.invalidateQueries({ queryKey: buyerKeys.orders });
      toast.success(translate("toast.receiptUploaded"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.receiptUploadError"))),
  });
}

export function useConfirmOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => buyerApi.confirmOrder(orderId),
    onSuccess: (_data, orderId) => {
      qc.invalidateQueries({ queryKey: buyerKeys.orderDetail(orderId) });
      qc.invalidateQueries({ queryKey: buyerKeys.orders });
      toast.success(translate("toast.orderConfirmed"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.orderConfirmError"))),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => buyerApi.cancelOrder(orderId),
    onSuccess: (_data, orderId) => {
      qc.invalidateQueries({ queryKey: buyerKeys.orderDetail(orderId) });
      qc.invalidateQueries({ queryKey: buyerKeys.orders });
      toast.success(translate("toast.orderCancelled"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.orderCancelError"))),
  });
}
