import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { translate } from "@/i18n/translations";
import { buyerKeys } from "@/features/buyer/buyer-hooks";
import { sellerKeys } from "@/features/seller/seller-hooks";
import { adminKeys } from "@/features/admin/admin-hooks";
import { disputesApi, type OpenDisputeRequest, type ResolveDisputeRequest } from "./disputes-api";

export const disputeKeys = {
  mine: ["disputes", "mine"] as const,
  all: ["disputes", "all"] as const,
  detail: (id: number) => ["disputes", id] as const,
};

/** Invalidates the order caches an order-affecting dispute action may have changed. */
function invalidateOrderCaches(qc: ReturnType<typeof useQueryClient>, orderId: number) {
  qc.invalidateQueries({ queryKey: buyerKeys.orders });
  qc.invalidateQueries({ queryKey: buyerKeys.orderDetail(orderId) });
  qc.invalidateQueries({ queryKey: sellerKeys.orders });
  qc.invalidateQueries({ queryKey: sellerKeys.orderDetail(orderId) });
  qc.invalidateQueries({ queryKey: adminKeys.orders });
  qc.invalidateQueries({ queryKey: adminKeys.orderDetail(orderId) });
}

export function useMyDisputes() {
  return useQuery({ queryKey: disputeKeys.mine, queryFn: disputesApi.getMine });
}

export function useAllDisputes() {
  return useQuery({ queryKey: disputeKeys.all, queryFn: disputesApi.getAll });
}

export function useDisputeDetails(id: number) {
  return useQuery({
    queryKey: disputeKeys.detail(id),
    queryFn: () => disputesApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useOpenDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OpenDisputeRequest) => disputesApi.open(payload),
    onSuccess: (dispute) => {
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      invalidateOrderCaches(qc, dispute.orderId);
      toast.success(translate("toast.disputeOpened"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeOpenError"))),
  });
}

export function useStartReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disputesApi.startReview(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: disputeKeys.detail(id) });
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      toast.success(translate("toast.disputeReviewStarted"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeReviewError"))),
  });
}

export function useRequestEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disputesApi.requestEvidence(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: disputeKeys.detail(id) });
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      toast.success(translate("toast.disputeEvidenceRequested"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeEvidenceError"))),
  });
}

export function useResolveBuyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; orderId: number; payload: ResolveDisputeRequest }) =>
      disputesApi.resolveBuyer(args.id, args.payload),
    onSuccess: (_d, args) => {
      qc.invalidateQueries({ queryKey: disputeKeys.detail(args.id) });
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      invalidateOrderCaches(qc, args.orderId);
      toast.success(translate("toast.disputeResolved"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeResolveError"))),
  });
}

export function useResolveSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; orderId: number; payload: ResolveDisputeRequest }) =>
      disputesApi.resolveSeller(args.id, args.payload),
    onSuccess: (_d, args) => {
      qc.invalidateQueries({ queryKey: disputeKeys.detail(args.id) });
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      invalidateOrderCaches(qc, args.orderId);
      toast.success(translate("toast.disputeResolved"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeResolveError"))),
  });
}

export function useCloseDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => disputesApi.close(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: disputeKeys.detail(id) });
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: disputeKeys.mine });
      toast.success(translate("toast.disputeClosed"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.disputeCloseError"))),
  });
}
