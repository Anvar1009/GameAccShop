import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSellerOrders } from "./seller-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { ProductMedia } from "@/components/ProductMedia";
import { formatDate, formatPrice } from "@/lib/format";

export function SellerOrdersPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useSellerOrders();

  if (isLoading) return <PageLoader label={t("sellerOrders.loading")} />;

  const list = [...(data ?? [])].sort((a, b) => b.orderId - a.orderId);

  return (
    <div className="page-container">
      <PageHeader title={t("sellerOrders.title")} description={t("sellerOrders.desc")} />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState title={t("buyerDash.noOrdersTitle")} description={t("sellerOrders.noneDesc")} icon={ShoppingCart} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.account")}</TableHead>
                <TableHead>{t("table.buyer")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.payment")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-right">{t("table.price")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((o) => (
                <TableRow key={o.orderId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <ProductMedia src={o.productImage} alt={o.productTitle} className="h-full w-full" />
                      </div>
                      <span className="line-clamp-1 max-w-[200px] font-medium">
                        {o.productTitle || t("order.orderN", { id: o.orderId })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.buyerName}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                  <TableCell><PaymentStatusBadge value={o.paymentStatus} /></TableCell>
                  <TableCell><OrderStatusBadge value={o.status} /></TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(o.price)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/seller/orders/${o.orderId}`}>{t("common.details")}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
