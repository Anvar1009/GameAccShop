import { Link } from "react-router-dom";
import { ArrowRight, Clock, Package, ShoppingBag, Store } from "lucide-react";
import { useBuyerOrders } from "./buyer-hooks";
import { useAuth } from "@/features/auth/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { ProductMedia } from "@/components/ProductMedia";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderStatus, PaymentStatus, isOrderStatus, isPaymentStatus } from "@/lib/enums";

export function BuyerDashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: orders, isLoading, isError, refetch } = useBuyerOrders();

  if (isLoading) return <PageLoader label={t("buyerDash.loading")} />;
  if (isError) return <div className="page-container"><ErrorState onRetry={() => refetch()} /></div>;

  const list = orders ?? [];
  const active = list.filter(
    (o) => !isOrderStatus(o.status, OrderStatus.Completed) && !isOrderStatus(o.status, OrderStatus.Cancelled)
  );
  const awaitingPayment = list.filter((o) => isPaymentStatus(o.paymentStatus, PaymentStatus.Pending) && isOrderStatus(o.status, OrderStatus.WaitingPayment));
  const completed = list.filter((o) => isOrderStatus(o.status, OrderStatus.Completed) || isOrderStatus(o.status, OrderStatus.BuyerConfirmed));
  const recent = [...list].sort((a, b) => b.orderId - a.orderId).slice(0, 5);

  return (
    <div className="page-container">
      <PageHeader
        title={t("buyerDash.welcome", { name: user?.login ?? t("buyerDash.defaultBuyer") })}
        description={t("buyerDash.desc")}
        actions={
          <Button asChild>
            <Link to="/products">
              {t("buyerDash.browse")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("buyerDash.totalOrders")} value={list.length} icon={ShoppingBag} tone="primary" />
        <StatCard label={t("buyerDash.active")} value={active.length} icon={Package} tone="warning" />
        <StatCard label={t("buyerDash.awaitingPayment")} value={awaitingPayment.length} icon={Clock} tone="danger" />
        <StatCard label={t("buyerDash.completed")} value={completed.length} icon={Store} tone="success" />
      </div>

      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{t("buyerDash.recentOrders")}</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/orders">
              {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <EmptyState
              title={t("buyerDash.noOrdersTitle")}
              description={t("buyerDash.noOrdersDesc")}
              icon={ShoppingBag}
              action={
                <Button asChild>
                  <Link to="/products">{t("buyerDash.browse")}</Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {recent.map((o) => (
                <Link
                  key={o.orderId}
                  to={`/orders/${o.orderId}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <ProductMedia src={o.medias?.[0]} alt={o.productTitle} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {o.productDescription?.trim() || o.productTitle || t("order.orderN", { id: o.orderId })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {o.sellerName} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <PaymentStatusBadge value={o.paymentStatus} />
                    <OrderStatusBadge value={o.status} />
                  </div>
                  <span className="font-semibold text-foreground">{formatPrice(o.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
