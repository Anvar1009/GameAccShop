import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
  Package,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import { useAdminOrders, useAdminPayments, useAdminStats } from "./admin-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { PaymentStatusBadge } from "@/components/StatusBadge";
import { DonutChart, type DonutSegment } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { formatDate, formatPrice } from "@/lib/format";
import {
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  isPaymentStatus,
  orderStatusMeta,
  paymentStatusMeta,
  productStatusMeta,
} from "@/lib/enums";

const ORDER_STATUSES = [
  OrderStatus.WaitingPayment,
  OrderStatus.PaymentConfirmed,
  OrderStatus.TransferInProgress,
  OrderStatus.BuyerConfirmed,
  OrderStatus.Completed,
  OrderStatus.Cancelled,
  OrderStatus.Disputed,
];

const PAYMENT_STATUSES = [
  PaymentStatus.Pending,
  PaymentStatus.Confirmed,
  PaymentStatus.Released,
  PaymentStatus.Cancelled,
];

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const statsQuery = useAdminStats();
  const paymentsQuery = useAdminPayments();
  const ordersQuery = useAdminOrders();

  const isLoading = statsQuery.isLoading || paymentsQuery.isLoading || ordersQuery.isLoading;
  const isError = statsQuery.isError || paymentsQuery.isError || ordersQuery.isError;

  if (isLoading) return <PageLoader label={t("adminDash.loading")} />;
  if (isError || !statsQuery.data)
    return (
      <div className="page-container">
        <ErrorState
          onRetry={() => {
            statsQuery.refetch();
            paymentsQuery.refetch();
            ordersQuery.refetch();
          }}
        />
      </div>
    );

  const stats = statsQuery.data;
  const payments = paymentsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  const pending = payments.filter((p) => isPaymentStatus(p.status, PaymentStatus.Pending));
  const released = payments.filter((p) => isPaymentStatus(p.status, PaymentStatus.Released));
  const releasedVolume = released.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const queue = [...pending].sort((a, b) => b.paymentId - a.paymentId).slice(0, 6);

  const orderSegments: DonutSegment[] = ORDER_STATUSES.map((status) => ({
    key: String(status),
    label: t(orderStatusMeta(status).labelKey),
    value: orders.filter((o) => o.status === status).length,
  }));

  const paymentSegments: DonutSegment[] = PAYMENT_STATUSES.map((status) => ({
    key: String(status),
    label: t(paymentStatusMeta(status).labelKey),
    value: payments.filter((p) => p.status === status).length,
  }));

  const productSegments: DonutSegment[] = [
    { key: "active", label: t(productStatusMeta(ProductStatus.Active).labelKey), value: stats.activeProducts },
    { key: "reserved", label: t(productStatusMeta(ProductStatus.Reserved).labelKey), value: stats.reservedProducts },
    { key: "sold", label: t(productStatusMeta(ProductStatus.Sold).labelKey), value: stats.soldProducts },
    { key: "deleted", label: t(productStatusMeta(ProductStatus.Deleted).labelKey), value: stats.deletedProducts },
  ];

  const registrationPoints = stats.userRegistrationTrend.map((p) => ({
    date: p.date,
    value: p.count,
  }));

  return (
    <div className="page-container">
      <PageHeader
        title={t("adminDash.title")}
        description={t("adminDash.desc")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("adminDash.totalUsers")} value={stats.totalUsers} icon={Users} tone="primary" />
        <StatCard label={t("adminDash.totalProducts")} value={stats.totalProducts} icon={Package} tone="primary" />
        <StatCard label={t("adminDash.totalOrders")} value={orders.length} icon={ClipboardList} tone="primary" />
        <StatCard
          label={t("adminDash.pendingPayments")}
          value={pending.length}
          icon={FileCheck2}
          tone="warning"
          hint={t("adminDash.awaitingReviewHint")}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("adminDash.ordersByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart segments={orderSegments} centerLabel={t("table.order")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("adminDash.paymentsByStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DonutChart segments={paymentSegments} centerLabel={t("adminReview.payment")} />
            <p className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
              {t("adminDash.releasedVolume")}: <span className="font-semibold text-foreground">{formatPrice(releasedVolume)}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("adminDash.productsByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart segments={productSegments} centerLabel={t("adminDash.totalProducts")} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("adminDash.registrationTrend")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart points={registrationPoints} />
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("adminDash.reviewQueue")}</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/payments">
                {t("adminDash.allPayments")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <EmptyState title={t("adminDash.allCaughtUp")} description={t("adminDash.noReview")} icon={FileCheck2} />
            ) : (
              <div className="divide-y divide-border">
                {queue.map((p) => (
                  <Link
                    key={p.paymentId}
                    to={`/admin/payments/${p.paymentId}`}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-amber-600">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {t("adminDash.paymentOrderLine", { payment: p.paymentId, order: p.orderId })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {p.buyerName} → {p.sellerName} · {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <PaymentStatusBadge value={p.status} />
                    <span className="font-semibold">{formatPrice(p.amount)}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("adminDash.manage")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/payments">
                <CreditCard className="h-4 w-4" /> {t("adminDash.reviewPayments")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/orders">
                <FileCheck2 className="h-4 w-4" /> {t("adminDash.viewAllOrders")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/disputes">
                <ShieldAlert className="h-4 w-4" /> {t("nav.disputes")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/payment-accounts">
                <Wallet className="h-4 w-4" /> {t("adminDash.paymentAccounts")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
