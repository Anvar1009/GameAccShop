import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Send, User } from "lucide-react";
import { useSellerOrderDetails } from "./seller-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductMedia } from "@/components/ProductMedia";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { ErrorState, PageLoader } from "@/components/states";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { formatDateTime, formatPrice } from "@/lib/format";
import { OrderStatus, PaymentStatus, isOrderStatus, isPaymentStatus, paymentMethodKey } from "@/lib/enums";

export function SellerOrderDetailsPage() {
  const { orderId: rawId } = useParams();
  const orderId = Number(rawId);
  const { t } = useTranslation();
  const { data: order, isLoading, isError, refetch } = useSellerOrderDetails(orderId);

  if (isLoading) return <PageLoader label={t("orderDetails.loading")} />;
  if (isError || !order)
    return (
      <div className="page-container">
        <ErrorState message={t("orderDetails.notFound")} onRetry={() => refetch()} />
      </div>
    );

  const paymentConfirmed =
    isPaymentStatus(order.paymentStatus, PaymentStatus.Confirmed) ||
    isOrderStatus(order.status, OrderStatus.PaymentConfirmed) ||
    isOrderStatus(order.status, OrderStatus.TransferInProgress);

  return (
    <div className="page-container">
      <Link
        to="/seller/orders"
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
          <Card>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row">
              <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-32 sm:w-40">
                <ProductMedia src={order.medias?.[0]} alt={order.productTitle} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  {order.productDescription?.trim() || order.productTitle || t("product.accountN", { id: order.productId })}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Array.from(new Set(order.tags ?? [])).map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-2xl font-bold text-primary">{formatPrice(order.price)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetails.orderProgress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline status={order.status} />
            </CardContent>
          </Card>

          {/* Chat with the buyer */}
          <ChatPanel orderId={order.orderId} peerName={order.buyerName} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("sellerOrderDetails.whatToDo")}</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentConfirmed ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-sm text-foreground">
                    <Send className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>
                      {t("sellerOrderDetails.paymentConfirmedNote")}
                    </span>
                  </div>
                </div>
              ) : isOrderStatus(order.status, OrderStatus.Cancelled) ? (
                <p className="text-sm text-muted-foreground">{t("sellerOrderDetails.cancelledNote")}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("sellerOrderDetails.waitingNote")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("sellerOrderDetails.buyer")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.buyerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {order.buyerPhone ? (
                  <a href={`tel:${order.buyerPhone}`} className="text-primary hover:underline">
                    {order.buyerPhone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
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
    </div>
  );
}
