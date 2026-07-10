import { useQuery } from "@tanstack/react-query";
import { productsApi } from "./products-api";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: number) => ["products", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: productsApi.getAll,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
