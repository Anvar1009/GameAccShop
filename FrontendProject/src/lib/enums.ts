/**
 * The backend serializes enums as NUMBERS (no JsonStringEnumConverter is
 * registered). These maps mirror the C# enum ordinals exactly. We also accept
 * the string names defensively in case serialization changes.
 */

import type { TranslationKey } from "@/i18n/translations";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

// Domain.Models.OrdersModel.OrderStatus
export enum OrderStatus {
  WaitingPayment = 0,
  PaymentConfirmed = 1,
  TransferInProgress = 2,
  BuyerConfirmed = 3,
  Completed = 4,
  Cancelled = 5,
  Disputed = 6,
}

// Domain.Models.PaymentModel.PaymentStatus
export enum PaymentStatus {
  Pending = 0,
  Confirmed = 1,
  Released = 2,
  Cancelled = 3,
}

// Domain.Models.ChatModels.NotificationType
export enum NotificationType {
  NewOrder = 0,
  PaymentUploaded = 1,
  PaymentConfirmed = 2,
  BuyerConfirmed = 3,
  PaymentReleased = 4,
  DisputeOpened = 5,
  DisputeUnderReview = 6,
  DisputeEvidenceRequested = 7,
  DisputeResolved = 8,
  DisputeClosed = 9,
  DisputeEvidenceUploaded = 10,
}

// Domain.Models.OrdersModel.DisputeStatus (explicit values start at 1)
export enum DisputeStatus {
  Open = 1,
  UnderReview = 2,
  WaitingEvidence = 3,
  ResolvedBuyer = 4,
  ResolvedSeller = 5,
  Closed = 6,
}

// Domain.Models.ChatModels.NotificationAudience — which side of the order the
// recipient is on. The type alone is ambiguous (PaymentConfirmed goes to both
// buyer and seller), so this is what decides where a notification links to.
export enum NotificationAudience {
  Buyer = 0,
  Seller = 1,
  Admin = 2,
}

// Domain.Models.PaymentModel.PaymentMethod (explicit values start at 1)
export enum PaymentMethod {
  CardTransfer = 1,
  Click = 2,
  Payme = 3,
  UzumBank = 4,
  Stripe = 5,
}

/**
 * Meta carries a translation KEY (not a literal label) so the label can be
 * localized at render time via the i18n `t()` function or standalone
 * `translate()`. Tone stays here because it's presentation, not language.
 */
type Meta = { labelKey: TranslationKey; tone: BadgeTone };

const ORDER_STATUS_META: Record<OrderStatus, Meta> = {
  [OrderStatus.WaitingPayment]: { labelKey: "status.order.waitingPayment", tone: "warning" },
  [OrderStatus.PaymentConfirmed]: { labelKey: "status.order.paymentConfirmed", tone: "info" },
  [OrderStatus.TransferInProgress]: { labelKey: "status.order.transferInProgress", tone: "info" },
  [OrderStatus.BuyerConfirmed]: { labelKey: "status.order.buyerConfirmed", tone: "success" },
  [OrderStatus.Completed]: { labelKey: "status.order.completed", tone: "success" },
  [OrderStatus.Cancelled]: { labelKey: "status.order.cancelled", tone: "danger" },
  [OrderStatus.Disputed]: { labelKey: "status.order.disputed", tone: "danger" },
};

const PAYMENT_STATUS_META: Record<PaymentStatus, Meta> = {
  [PaymentStatus.Pending]: { labelKey: "status.payment.pending", tone: "warning" },
  [PaymentStatus.Confirmed]: { labelKey: "status.payment.confirmed", tone: "success" },
  [PaymentStatus.Released]: { labelKey: "status.payment.released", tone: "success" },
  [PaymentStatus.Cancelled]: { labelKey: "status.payment.cancelled", tone: "danger" },
};

const DISPUTE_STATUS_META: Record<DisputeStatus, Meta> = {
  [DisputeStatus.Open]: { labelKey: "status.dispute.open", tone: "danger" },
  [DisputeStatus.UnderReview]: { labelKey: "status.dispute.underReview", tone: "warning" },
  [DisputeStatus.WaitingEvidence]: { labelKey: "status.dispute.waitingEvidence", tone: "warning" },
  [DisputeStatus.ResolvedBuyer]: { labelKey: "status.dispute.resolvedBuyer", tone: "success" },
  [DisputeStatus.ResolvedSeller]: { labelKey: "status.dispute.resolvedSeller", tone: "success" },
  [DisputeStatus.Closed]: { labelKey: "status.dispute.closed", tone: "neutral" },
};

/**
 * Notification copy is localized on the client: the backend stores one Uzbek
 * string per notification, but the reader may be on ru/en. Body keys take an
 * `{id}` param (the order number).
 */
type NotificationMeta = {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  tone: BadgeTone;
};

const NOTIFICATION_META: Record<NotificationType, NotificationMeta> = {
  [NotificationType.NewOrder]: {
    titleKey: "notif.newOrder.title",
    bodyKey: "notif.newOrder.body",
    tone: "info",
  },
  [NotificationType.PaymentUploaded]: {
    titleKey: "notif.paymentUploaded.title",
    bodyKey: "notif.paymentUploaded.body",
    tone: "warning",
  },
  [NotificationType.PaymentConfirmed]: {
    titleKey: "notif.paymentConfirmed.title",
    bodyKey: "notif.paymentConfirmed.body",
    tone: "success",
  },
  [NotificationType.BuyerConfirmed]: {
    titleKey: "notif.buyerConfirmed.title",
    bodyKey: "notif.buyerConfirmed.body",
    tone: "success",
  },
  [NotificationType.PaymentReleased]: {
    titleKey: "notif.paymentReleased.title",
    bodyKey: "notif.paymentReleased.body",
    tone: "success",
  },
  [NotificationType.DisputeOpened]: {
    titleKey: "notif.disputeOpened.title",
    bodyKey: "notif.disputeOpened.body",
    tone: "danger",
  },
  [NotificationType.DisputeUnderReview]: {
    titleKey: "notif.disputeUnderReview.title",
    bodyKey: "notif.disputeUnderReview.body",
    tone: "warning",
  },
  [NotificationType.DisputeEvidenceRequested]: {
    titleKey: "notif.disputeEvidenceRequested.title",
    bodyKey: "notif.disputeEvidenceRequested.body",
    tone: "warning",
  },
  [NotificationType.DisputeResolved]: {
    titleKey: "notif.disputeResolved.title",
    bodyKey: "notif.disputeResolved.body",
    tone: "success",
  },
  [NotificationType.DisputeClosed]: {
    titleKey: "notif.disputeClosed.title",
    bodyKey: "notif.disputeClosed.body",
    tone: "neutral",
  },
  [NotificationType.DisputeEvidenceUploaded]: {
    titleKey: "notif.disputeEvidenceUploaded.title",
    bodyKey: "notif.disputeEvidenceUploaded.body",
    tone: "info",
  },
};

/**
 * Returns localizable meta for a notification type, or undefined for a type the
 * client does not know — callers then fall back to the server's own text.
 */
export function notificationMeta(
  value: number | string | null | undefined
): NotificationMeta | undefined {
  const key = normalize<NotificationType>(value, NotificationType as never);
  return key != null ? NOTIFICATION_META[key] : undefined;
}

const PAYMENT_METHOD_KEY: Record<PaymentMethod, TranslationKey> = {
  [PaymentMethod.CardTransfer]: "method.card",
  [PaymentMethod.Click]: "method.click",
  [PaymentMethod.Payme]: "method.payme",
  [PaymentMethod.UzumBank]: "method.uzum",
  [PaymentMethod.Stripe]: "method.stripe",
};

function normalize<T extends number>(
  value: number | string | null | undefined,
  enumObj: Record<string, string | number>
): T | undefined {
  if (value == null) return undefined;
  if (typeof value === "number") return value as T;
  // string: could be the numeric string or the enum name
  if (/^\d+$/.test(value)) return Number(value) as T;
  const found = enumObj[value];
  return typeof found === "number" ? (found as T) : undefined;
}

export function orderStatusMeta(value: number | string | null | undefined): Meta {
  const key = normalize<OrderStatus>(value, OrderStatus as never);
  return (key != null && ORDER_STATUS_META[key]) || { labelKey: "status.unknown", tone: "neutral" };
}

export function paymentStatusMeta(value: number | string | null | undefined): Meta {
  const key = normalize<PaymentStatus>(value, PaymentStatus as never);
  return (key != null && PAYMENT_STATUS_META[key]) || { labelKey: "status.unknown", tone: "neutral" };
}

export function disputeStatusMeta(value: number | string | null | undefined): Meta {
  const key = normalize<DisputeStatus>(value, DisputeStatus as never);
  return (key != null && DISPUTE_STATUS_META[key]) || { labelKey: "status.unknown", tone: "neutral" };
}

export function isDisputeStatus(
  value: number | string | null | undefined,
  status: DisputeStatus
): boolean {
  return normalize<DisputeStatus>(value, DisputeStatus as never) === status;
}

/** Returns a translation key for the payment method (localize via t/translate). */
export function paymentMethodKey(value: number | string | null | undefined): TranslationKey {
  const key = normalize<PaymentMethod>(value, PaymentMethod as never);
  return (key != null && PAYMENT_METHOD_KEY[key]) || "method.unknown";
}

export function isOrderStatus(
  value: number | string | null | undefined,
  status: OrderStatus
): boolean {
  return normalize<OrderStatus>(value, OrderStatus as never) === status;
}

export function isPaymentStatus(
  value: number | string | null | undefined,
  status: PaymentStatus
): boolean {
  return normalize<PaymentStatus>(value, PaymentStatus as never) === status;
}
