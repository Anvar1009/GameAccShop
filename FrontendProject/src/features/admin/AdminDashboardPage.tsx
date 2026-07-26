import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, DollarSign, FileCheck2, ShieldAlert, Wallet } from "lucide-react";
import { useAdminPayments } from "./admin-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { PaymentStatusBadge } from "@/components/StatusBadge";
import { formatDate, formatPrice } from "@/lib/format";
import { PaymentStatus, isPaymentStatus } from "@/lib/enums";

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useAdminPayments();

  if (isLoading) return <PageLoader label={t("adminDash.loading")} />;
  if (isError)
    return (
      <div className="page-container">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );

  const payments = data ?? [];
  const pending = payments.filter((p) => isPaymentStatus(p.status, PaymentStatus.Pending));
  const confirmed = payments.filter((p) => isPaymentStatus(p.status, PaymentStatus.Confirmed));
  const released = payments.filter((p) => isPaymentStatus(p.status, PaymentStatus.Released));
  const volume = released.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const queue = [...pending].sort((a, b) => b.paymentId - a.paymentId).slice(0, 6);

  return (
    <div className="page-container">
      <PageHeader
        title={t("adminDash.title")}
        description={t("adminDash.desc")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("adminDash.awaitingReview")} value={pending.length} icon={FileCheck2} tone="warning" hint={t("adminDash.awaitingReviewHint")} />
        <StatCard label={t("adminDash.confirmed")} value={confirmed.length} icon={CreditCard} tone="primary" />
        <StatCard label={t("adminDash.released")} value={released.length} icon={Wallet} tone="success" />
        <StatCard label={t("adminDash.releasedVolume")} value={formatPrice(volume)} icon={DollarSign} tone="success" />
      </div>

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
