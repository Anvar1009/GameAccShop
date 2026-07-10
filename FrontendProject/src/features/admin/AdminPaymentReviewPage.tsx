import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, CreditCard, ExternalLink, FileText, Receipt, Wallet } from "lucide-react";
import {
  useAdminPaymentDetails,
  useConfirmPayment,
  useReleasePayment,
} from "./admin-hooks";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { ProductMedia } from "@/components/ProductMedia";
import { ErrorState, PageLoader } from "@/components/states";
import { useTranslation } from "@/i18n/useTranslation";
import { formatDateTime, formatPrice, mediaUrl } from "@/lib/format";
import { PaymentStatus, isPaymentStatus, paymentMethodKey } from "@/lib/enums";

export function AdminPaymentReviewPage() {
  const { id: rawId } = useParams();
  const paymentId = Number(rawId);
  const { t } = useTranslation();
  const { data: payment, isLoading, isError, refetch } = useAdminPaymentDetails(paymentId);
  const confirmPayment = useConfirmPayment();
  const releasePayment = useReleasePayment();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);

  if (isLoading) return <PageLoader label={t("adminReview.loading")} />;
  if (isError || !payment)
    return (
      <div className="page-container">
        <ErrorState message={t("adminReview.loadError")} onRetry={() => refetch()} />
      </div>
    );

  const receipt = payment.receiptUrl;
  const receiptIsPdf = !!receipt && /\.pdf$/i.test(receipt);
  const showConfirm = payment.canConfirmPayment || isPaymentStatus(payment.status, PaymentStatus.Pending);
  const showRelease = payment.canReleasePayment || isPaymentStatus(payment.status, PaymentStatus.Confirmed);

  const doConfirm = async () => {
    await confirmPayment.mutateAsync(paymentId);
    setConfirmOpen(false);
  };
  const doRelease = async () => {
    await releasePayment.mutateAsync(paymentId);
    setReleaseOpen(false);
  };

  return (
    <div className="page-container">
      <Link
        to="/admin/payments"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back.payments")}
      </Link>

      <PageHeader
        title={t("adminReview.payment") + ` #${payment.paymentId}`}
        description={t("adminReview.headerDesc", { order: payment.orderId, date: formatDateTime(payment.createdAt) })}
        actions={
          <div className="flex items-center gap-2">
            <PaymentStatusBadge value={payment.status} />
            <OrderStatusBadge value={payment.orderStatus} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Receipt */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> {t("adminReview.receiptTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!receipt ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-16 text-center text-muted-foreground">
                  <FileText className="h-8 w-8" />
                  <p className="text-sm">{t("adminReview.noReceipt")}</p>
                </div>
              ) : receiptIsPdf ? (
                <a
                  href={mediaUrl(receipt)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-4 hover:border-primary"
                >
                  <span className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-medium">{t("adminReview.openPdf")}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ) : (
                <a href={mediaUrl(receipt)} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={mediaUrl(receipt)}
                    alt={t("adminReview.receiptAlt")}
                    className="mx-auto max-h-[520px] rounded-xl border border-border object-contain"
                  />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Product */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("adminReview.account")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-40">
                <ProductMedia src={payment.medias?.[0]} alt={payment.productDescription} className="h-full w-full" />
              </div>
              <div className="text-sm">
                <p className="font-medium">{payment.productDescription?.trim() || t("product.accountN", { id: payment.productId })}</p>
                <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                  <Mini label={t("product.strength")} value={payment.strength} />
                  <Mini label={t("product.coins")} value={payment.coins} />
                  <Mini label={t("product.players")} value={payment.playerCount} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Array.from(new Set(payment.tags ?? [])).map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("adminReview.decision")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {showConfirm && (
                <Button className="w-full" onClick={() => setConfirmOpen(true)}>
                  <Check className="h-4 w-4" /> {t("adminReview.confirmPayment")}
                </Button>
              )}
              {showRelease && (
                <Button variant="success" className="w-full" onClick={() => setReleaseOpen(true)}>
                  <Wallet className="h-4 w-4" /> {t("adminReview.releaseToSeller")}
                </Button>
              )}
              {!showConfirm && !showRelease && (
                <p className="text-sm text-muted-foreground">
                  {t("adminReview.noActions")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t("adminReview.decisionNote")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> {t("adminReview.payment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label={t("adminReview.amount")} value={formatPrice(payment.amount)} strong />
              <Row label={t("adminReview.method")} value={t(paymentMethodKey(payment.paymentMethod))} />
              <Row label={t("adminReview.payToAccount")} value={payment.accountName} />
              <Row label={t("adminReview.cardNumber")} value={payment.cardNumber} mono />
              <Row label={t("adminReview.owner")} value={payment.ownerName} />
              {payment.confirmedAt && <Row label={t("adminReview.confirmed")} value={formatDateTime(payment.confirmedAt)} />}
              {payment.releasedAt && <Row label={t("adminReview.released")} value={formatDateTime(payment.releasedAt)} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("adminReview.parties")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("adminReview.buyer")}</p>
                <p className="font-medium">{payment.buyerName}</p>
                <p className="text-muted-foreground">{payment.buyerPhone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("adminReview.seller")}</p>
                <p className="font-medium">{payment.sellerName}</p>
                <p className="text-muted-foreground">{payment.sellerPhone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("adminReview.confirmDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("adminReview.confirmDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={doConfirm} loading={confirmPayment.isPending}>{t("adminReview.confirmPayment")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("adminReview.releaseDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("adminReview.releaseDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="success" onClick={doRelease} loading={releasePayment.isPending}>
              {t("adminReview.releasePayment")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${strong ? "text-base font-bold text-foreground" : "font-medium"} ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary/60 px-1 py-1.5">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
