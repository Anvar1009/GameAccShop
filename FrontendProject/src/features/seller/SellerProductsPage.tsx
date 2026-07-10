import { useState } from "react";
import { Link } from "react-router-dom";
import { Coins, Package, Pencil, Plus, Trash2, Users, Zap } from "lucide-react";
import { useDeleteProduct, useMyProducts } from "./seller-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { ProductMedia } from "@/components/ProductMedia";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Product } from "@/types/api";

export function SellerProductsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const [target, setTarget] = useState<Product | null>(null);

  if (isLoading) return <PageLoader label={t("sellerProducts.loading")} />;

  const list = [...(data ?? [])].sort((a, b) => b.id - a.id);

  const confirmDelete = async () => {
    if (!target) return;
    await deleteProduct.mutateAsync(target.id);
    setTarget(null);
  };

  return (
    <div className="page-container">
      <PageHeader
        title={t("sellerProducts.title")}
        description={t("sellerProducts.desc")}
        actions={
          <Button asChild>
            <Link to="/seller/products/new">
              <Plus className="h-4 w-4" /> {t("sellerProducts.newListing")}
            </Link>
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          title={t("sellerProducts.noneTitle")}
          description={t("sellerProducts.noneDesc")}
          icon={Package}
          action={
            <Button asChild>
              <Link to="/seller/products/new">
                <Plus className="h-4 w-4" /> {t("sellerProducts.listAccount")}
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.account")}</TableHead>
                <TableHead>{t("table.stats")}</TableHead>
                <TableHead>{t("table.tags")}</TableHead>
                <TableHead className="text-right">{t("table.price")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <ProductMedia src={p.medias?.[0]} alt={p.description} className="h-full w-full" />
                      </div>
                      <span className="line-clamp-1 max-w-[220px] font-medium">
                        {p.description?.trim() || t("product.accountN", { id: p.id })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" />{formatNumber(p.accStrength)}</span>
                      <span className="inline-flex items-center gap-1"><Coins className="h-3.5 w-3.5" />{formatNumber(p.coinsCount)}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{formatNumber(p.playerCount)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(p.tags ?? [])).slice(0, 2).map((t, i) => (
                        <Badge key={`${t}-${i}`} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(p.accPrice)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/seller/products/${p.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" /> {t("common.edit")}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setTarget(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sellerProducts.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("sellerProducts.deleteDesc", {
                name: target?.description?.trim() || t("product.accountN", { id: target?.id ?? "" }),
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} loading={deleteProduct.isPending}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
