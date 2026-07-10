import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { translate } from "@/i18n/translations";
import { productKeys } from "@/features/products/products-hooks";
import { sellerApi, type ProductFormValues } from "./seller-api";

export const sellerKeys = {
  products: ["seller", "products"] as const,
  productDetail: (id: number) => ["seller", "products", id] as const,
  orders: ["seller", "orders"] as const,
  orderDetail: (id: number) => ["seller", "orders", id] as const,
};

export function useMyProducts() {
  return useQuery({ queryKey: sellerKeys.products, queryFn: sellerApi.getMyProducts });
}

export function useSellerProductDetails(productId: number) {
  return useQuery({
    queryKey: sellerKeys.productDetail(productId),
    queryFn: () => sellerApi.getProductDetails(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductFormValues) => sellerApi.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.products });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(translate("toast.productListed"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.productListError"))),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; sellerId: number; values: ProductFormValues }) =>
      sellerApi.update(args.id, args.sellerId, args.values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.products });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(translate("toast.productUpdated"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.productUpdateError"))),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sellerApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.products });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(translate("toast.productDeleted"));
    },
    onError: (e) => toast.error(getErrorMessage(e, translate("toast.productDeleteError"))),
  });
}

export function useSellerOrders() {
  return useQuery({ queryKey: sellerKeys.orders, queryFn: sellerApi.getOrders });
}

export function useSellerOrderDetails(orderId: number) {
  return useQuery({
    queryKey: sellerKeys.orderDetail(orderId),
    queryFn: () => sellerApi.getOrderDetails(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
  });
}
