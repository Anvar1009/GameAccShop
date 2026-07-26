import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BadgeCheck,
  FileSearch,
  Gavel,
  ImagePlus,
  ReceiptText,
  ShieldAlert,
  ShoppingCart,
  UserCheck,
  Wallet,
} from "lucide-react";
import type { AppNotification } from "@/types/api";
import {
  NotificationAudience,
  NotificationType,
  notificationMeta,
  type BadgeTone,
} from "@/lib/enums";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarkNotificationsRead, useNotifications } from "./notifications-hooks";

const ICONS: Record<NotificationType, typeof Bell> = {
  [NotificationType.NewOrder]: ShoppingCart,
  [NotificationType.PaymentUploaded]: ReceiptText,
  [NotificationType.PaymentConfirmed]: BadgeCheck,
  [NotificationType.BuyerConfirmed]: UserCheck,
  [NotificationType.PaymentReleased]: Wallet,
  [NotificationType.DisputeOpened]: ShieldAlert,
  [NotificationType.DisputeUnderReview]: FileSearch,
  [NotificationType.DisputeEvidenceRequested]: FileSearch,
  [NotificationType.DisputeResolved]: Gavel,
  [NotificationType.DisputeClosed]: Gavel,
  [NotificationType.DisputeEvidenceUploaded]: ImagePlus,
};

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  info: "bg-accent text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

/**
 * Where a notification takes you. The type alone is not enough — a buyer and a
 * seller both get PaymentConfirmed but their order pages differ — so this keys
 * off `audience`, which the backend sets per recipient.
 *
 * Admins have no per-order page; both admin-facing notifications are payment
 * work, so they land on the payments queue.
 */
function notificationLink(n: AppNotification): string | null {
  if (n.audience === NotificationAudience.Admin) return "/admin/payments";
  if (n.orderId == null) return null;
  if (n.audience === NotificationAudience.Buyer) return `/orders/${n.orderId}`;
  if (n.audience === NotificationAudience.Seller) return `/seller/orders/${n.orderId}`;
  return null;
}

export function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, isError } = useNotifications();
  const markRead = useMarkNotificationsRead();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // Opening the list is what counts as reading it.
    if (next && unreadCount > 0) markRead.mutate();
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("notif.open")}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <DropdownMenuLabel className="px-3 py-2.5">{t("notif.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 my-0" />

        {isError ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t("notif.loadError")}
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t("notif.empty")}
          </p>
        ) : (
          <ul className="max-h-[22rem] overflow-y-auto py-1">
            {notifications.map((n) => {
              const meta = notificationMeta(n.notificationType);
              const Icon = ICONS[n.notificationType as NotificationType] ?? Bell;
              const link = notificationLink(n);

              return (
                <li key={n.id}>
                  <button
                    type="button"
                    disabled={!link}
                    onClick={() => {
                      if (!link) return;
                      setOpen(false);
                      navigate(link);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                      link ? "hover:bg-secondary" : "cursor-default",
                      !n.isRead && "bg-accent/40"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        TONE_CLASS[meta?.tone ?? "neutral"]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {meta ? t(meta.titleKey) : n.title}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {meta ? t(meta.bodyKey, { id: n.orderId ?? 0 }) : n.message}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground/80">
                        {formatDateTime(n.createdAt)}
                      </span>
                    </span>
                    {!n.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
