import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Package, Plus, ShoppingCart, Timer } from "lucide-react";
import { useMyProducts, useSellerOrders } from "./seller-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { ProductMedia } from "@/components/ProductMedia";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatus, isOrderStatus } from "@/lib/enums";

export function SellerDashboardPage() {
  const { t } = useTranslation();
  const products = useMyProducts();
  const orders = useSellerOrders();

  if (products.isLoading || orders.isLoading) return <PageLoader label={t("sellerDash.loading")} />;
  if (products.isError || orders.isError)
    return (
      <div className="page-container">
        <ErrorState
          onRetry={() => {
            products.refetch();
            orders.refetch();
          }}
        />
      </div>
    );

  const productList = products.data ?? [];
  const orderList = orders.data ?? [];
  const completed = orderList.filter(
    (o) => isOrderStatus(o.status, OrderStatus.Completed) || isOrderStatus(o.status, OrderStatus.BuyerConfirmed)
  );
  const pending = orderList.filter(
    (o) => !isOrderStatus(o.status, OrderStatus.Completed) && !isOrderStatus(o.status, OrderStatus.Cancelled)
  );
  const revenue = completed.reduce((sum, o) => sum + (o.price ?? 0), 0);
  const recent = [...orderList].sort((a, b) => b.orderId - a.orderId).slice(0, 5);

  return (
    <div className="page-container">
      <PageHeader
        title={t("sellerDash.title")}
        description={t("sellerDash.desc")}
        actions={
          <Button asChild>
            <Link to="/seller/products/new">
              <Plus className="h-4 w-4" /> {t("sellerDash.newListing")}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("sellerDash.activeListings")} value={productList.length} icon={Package} tone="primary" />
        <StatCard label={t("sellerDash.totalOrders")} value={orderList.length} icon={ShoppingCart} tone="neutral" />
        <StatCard label={t("sellerDash.inProgress")} value={pending.length} icon={Timer} tone="warning" />
        <StatCard label={t("sellerDash.revenue")} value={formatPrice(revenue)} icon={DollarSign} tone="success" hint={t("sellerDash.completedHint", { n: completed.length })} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("sellerDash.recentOrders")}</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/seller/orders">
                {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <EmptyState title={t("buyerDash.noOrdersTitle")} description={t("sellerDash.noOrdersDesc")} icon={ShoppingCart} />
            ) : (
              <div className="divide-y divide-border">
                {recent.map((o) => (
                  <Link
                    key={o.orderId}
                    to={`/seller/orders/${o.orderId}`}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <ProductMedia src={o.productImage} alt={o.productTitle} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{o.productTitle || t("order.orderN", { id: o.orderId })}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.buyerName} · {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <OrderStatusBadge value={o.status} />
                    </div>
                    <span className="font-semibold">{formatPrice(o.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sellerDash.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/seller/products/new">
                <Plus className="h-4 w-4" /> {t("sellerDash.listNewAccount")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/seller/products">
                <Package className="h-4 w-4" /> {t("sellerDash.manageProducts")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/seller/orders">
                <ShoppingCart className="h-4 w-4" /> {t("sellerDash.viewOrders")}
              </Link>
            </Button>
            {pending.some((o) => o.paymentStatus != null) && (
              <div className="rounded-lg bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
                {t("sellerDash.credentialsNote")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
