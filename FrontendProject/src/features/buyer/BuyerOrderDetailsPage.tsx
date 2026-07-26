import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CreditCard, Phone, User, XCircle } from "lucide-react";
import {
  useBuyerOrderDetails,
  useCancelOrder,
  useConfirmOrder,
} from "./buyer-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ProductMedia } from "@/components/ProductMedia";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { ErrorState, PageLoader } from "@/components/states";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { OpenDisputeButton } from "@/features/disputes/OpenDisputeButton";
import { formatDateTime, formatPrice } from "@/lib/format";
import { OrderStatus, PaymentStatus, isOrderStatus, isPaymentStatus, paymentMethodKey } from "@/lib/enums";

export function BuyerOrderDetailsPage() {
  const { orderId: rawId } = useParams();
  const orderId = Number(rawId);
  const { t } = useTranslation();
  const { data: order, isLoading, isError, refetch } = useBuyerOrderDetails(orderId);
  const confirmOrder = useConfirmOrder();
  const cancelOrder = useCancelOrder();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) return <PageLoader label={t("orderDetails.loading")} />;
  if (isError || !order)
    return (
      <div className="page-container">
        <ErrorState message={t("orderDetails.notFound")} onRetry={() => refetch()} />
      </div>
    );

  const needsPayment =
    isOrderStatus(order.status, OrderStatus.WaitingPayment) &&
    isPaymentStatus(order.paymentStatus, PaymentStatus.Pending);
  const paymentConfirmed = isPaymentStatus(order.paymentStatus, PaymentStatus.Confirmed);
  const isDisputed = isOrderStatus(order.status, OrderStatus.Disputed);

  const handleConfirm = async () => {
    await confirmOrder.mutateAsync(orderId);
    setConfirmOpen(false);
  };
  const handleCancel = async () => {
    await cancelOrder.mutateAsync(orderId);
    setCancelOpen(false);
  };

  return (
    <div className="page-container">
      <Link
        to="/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back.orders")}
      </Link>

      <PageHeader
        title={t("order.orderN", { id: order.orderId })}
        description={t("orderDetails.placedOn", { date: formatDateTime(order.createdAt) })}
        actions={
          <div className="flex items-center gap-2">
            <PaymentStatusBadge value={order.paymentStatus} />
            <OrderStatusBadge value={order.status} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Product */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
              <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-32 sm:w-40">
                <ProductMedia
                  src={order.medias?.[0]}
                  alt={order.productTitle}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  {order.productDescription?.trim() || order.productTitle || t("product.accountN", { id: order.productId })}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Array.from(new Set(order.tags ?? [])).map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-2xl font-bold text-primary">{formatPrice(order.price)}</p>
                <Button asChild variant="link" className="mt-1 h-auto p-0 text-sm">
                  <Link to={`/products/${order.productId}`}>{t("orderDetails.viewListing")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetails.orderProgress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline status={order.status} />
            </CardContent>
          </Card>

          {/* Chat with the seller */}
          <ChatPanel orderId={order.orderId} peerName={order.sellerName} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetails.nextSteps")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {needsPayment && (
                <Button asChild className="w-full">
                  <Link to={`/payment/${order.orderId}`}>
                    <CreditCard className="h-4 w-4" /> {t("orderDetails.completePayment")}
                  </Link>
                </Button>
              )}
              {order.canConfirmOrder && (
                <Button
                  variant="success"
                  className="w-full"
                  onClick={() => setConfirmOpen(true)}
                >
                  <BadgeCheck className="h-4 w-4" /> {t("orderDetails.confirmReceived")}
                </Button>
              )}
              {order.canCancelOrder && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/5"
                  onClick={() => setCancelOpen(true)}
                >
                  <XCircle className="h-4 w-4" /> {t("orderDetails.cancelOrder")}
                </Button>
              )}
              {!needsPayment && !order.canConfirmOrder && !order.canCancelOrder && !isDisputed && (
                <p className="text-sm text-muted-foreground">
                  {t("orderDetails.noActions")}
                </p>
              )}
              {paymentConfirmed && (
                <p className="rounded-lg bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
                  {t("orderDetails.paymentConfirmedNote")}
                </p>
              )}
              {isDisputed ? (
                <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-amber-700">
                  {t("orderDetails.disputeOpenNote")}{" "}
                  <Link to="/disputes" className="font-medium underline">
                    {t("orderDetails.viewMyDisputes")}
                  </Link>
                </p>
              ) : (
                order.canOpenDispute && <OpenDisputeButton orderId={order.orderId} />
              )}
            </CardContent>
          </Card>

          {/* Seller */}
          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetails.seller")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.sellerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {order.sellerPhone ? (
                  <a href={`tel:${order.sellerPhone}`} className="text-primary hover:underline">
                    {order.sellerPhone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{t("orderDetails.availableAfterPayment")}</span>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("common.paymentMethod")}</span>
                <span className="font-medium">{t(paymentMethodKey(order.paymentMethod))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orderDetails.confirmDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("orderDetails.confirmDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("orderDetails.notYet")}
            </Button>
            <Button variant="success" onClick={handleConfirm} loading={confirmOrder.isPending}>
              {t("orderDetails.yesConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orderDetails.cancelDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("orderDetails.cancelDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {t("orderDetails.keepOrder")}
            </Button>
            <Button variant="destructive" onClick={handleCancel} loading={cancelOrder.isPending}>
              {t("orderDetails.cancelOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
