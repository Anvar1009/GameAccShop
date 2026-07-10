import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { translate } from "@/i18n/translations";
import { adminApi } from "./admin-api";
import type { PaymentAccountRequest } from "@/types/api";

export const adminKeys = {
  payments: ["admin", "payments"] as const,
  paymentDetail: (id: number) => ["admin", "payments", id] as const,
  orders: ["admin", "orders"] as const,
  orderDetail: (id: number) => ["admin", "orders", id] as const,
  paymentAccount: ["admin", "payment-account"] as const,
};

export function useAdminPayments() {
  return useQuery({ queryKey: adminKeys.payments, queryFn: adminApi.getPayments });
}

export function useAdminPaymentDetails(id: number) {
  return useQuery({
    queryKey: adminKeys.paymentDetail(id),
    queryFn: () => adminApi.getPaymentDetails(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.confirmPayment(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: adminKeys.payments });
      qc.invalidateQueries({ queryKey: adminKeys.paymentDetail(id) });
      qc.invalidateQueries({ queryKey: adminKeys.orders });
      toast.success(translate("toast.paymentConfirmed"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.paymentConfirmError"))),
  });
}

export function useReleasePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.releasePayment(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: adminKeys.payments });
      qc.invalidateQueries({ queryKey: adminKeys.paymentDetail(id) });
      qc.invalidateQueries({ queryKey: adminKeys.orders });
      toast.success(translate("toast.paymentReleased"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.paymentReleaseError"))),
  });
}

export function useAdminOrders() {
  return useQuery({ queryKey: adminKeys.orders, queryFn: adminApi.getOrders });
}

export function useAdminOrderDetails(orderId: number) {
  return useQuery({
    queryKey: adminKeys.orderDetail(orderId),
    queryFn: () => adminApi.getOrderDetails(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });
}

export function useActivePaymentAccount() {
  return useQuery({
    queryKey: adminKeys.paymentAccount,
    queryFn: adminApi.getActivePaymentAccount,
    retry: false,
  });
}

export function useCreatePaymentAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentAccountRequest) => adminApi.createPaymentAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.paymentAccount });
      toast.success(translate("toast.accountSaved"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.accountSaveError"))),
  });
}

export function useUpdatePaymentAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; payload: PaymentAccountRequest }) =>
      adminApi.updatePaymentAccount(args.id, args.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.paymentAccount });
      toast.success(translate("toast.accountUpdated"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.accountUpdateError"))),
  });
}

export function useDeletePaymentAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deletePaymentAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.paymentAccount });
      toast.success(translate("toast.accountDeleted"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.accountDeleteError"))),
  });
}
