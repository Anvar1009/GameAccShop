import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AppNotification } from "@/types/api";
import { getErrorMessage } from "@/lib/api";
import { notificationMeta } from "@/lib/enums";
import { translate } from "@/i18n/translations";
import { useAuth } from "@/features/auth/useAuth";
import { notificationsApi } from "./notifications-api";
import { createNotificationConnection } from "./notifications-signalr";

export const notificationKeys = {
  all: ["notifications"] as const,
};

/**
 * The current user's notifications: loaded over REST, then kept live by the
 * NotificationHub, which pushes each new one straight to this user.
 *
 * If the hub cannot connect the list is polled instead, so the bell still fills
 * in — just not instantly.
 */
export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const [isLive, setIsLive] = useState(false);

  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: notificationsApi.getAll,
    enabled: isAuthenticated,
    refetchInterval: isLive ? false : 30000,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const connection = createNotificationConnection();

    connection.on("ReceiveNotification", (incoming: AppNotification) => {
      qc.setQueryData<AppNotification[]>(notificationKeys.all, (prev = []) =>
        // The hub can re-deliver across a reconnect, and a poll may have raced
        // it here — key on id so the list never doubles up.
        prev.some((n) => n.id === incoming.id) ? prev : [incoming, ...prev]
      );

      const meta = notificationMeta(incoming.notificationType);
      toast(meta ? translate(meta.titleKey) : incoming.title, {
        description: meta
          ? translate(meta.bodyKey, { id: incoming.orderId ?? 0 })
          : incoming.message,
      });
    });

    connection.onreconnecting(() => setIsLive(false));
    connection.onreconnected(() => {
      setIsLive(true);
      // Anything sent while we were away was never pushed — pull it in.
      void qc.invalidateQueries({ queryKey: notificationKeys.all });
    });
    connection.onclose(() => {
      if (!cancelled) setIsLive(false);
    });

    (async () => {
      try {
        await connection.start();
        if (!cancelled) setIsLive(true);
      } catch {
        // Polling covers this.
        if (!cancelled) setIsLive(false);
      }
    })();

    return () => {
      cancelled = true;
      connection.off("ReceiveNotification");
      connection.stop().catch(() => {});
    };
  }, [isAuthenticated, qc]);

  const notifications = query.data ?? [];
  const unreadCount = notifications.reduce((n, x) => (x.isRead ? n : n + 1), 0);

  return {
    notifications,
    unreadCount,
    isLive,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/** Marks everything read — fired when the user opens the bell. */
export function useMarkNotificationsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    // Clear the badge on open; the list itself is already on screen.
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationKeys.all });
      const previous = qc.getQueryData<AppNotification[]>(notificationKeys.all);
      qc.setQueryData<AppNotification[]>(notificationKeys.all, (prev = []) =>
        prev.map((n) => (n.isRead ? n : { ...n, isRead: true }))
      );
      return { previous };
    },
    onError: (e, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(notificationKeys.all, context.previous);
      }
      toast.error(getErrorMessage(e, translate("notif.readError")));
    },
  });
}
