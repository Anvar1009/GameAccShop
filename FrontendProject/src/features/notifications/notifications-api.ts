import { api } from "@/lib/api";
import type { AppNotification } from "@/types/api";

/**
 * REST surface for notifications (backend: NotificationController). The realtime
 * push lives in notifications-signalr.ts; these endpoints load the list on
 * mount, keep the badge honest, and act as the fallback when the hub is down.
 */
export const notificationsApi = {
  // GET /api/Notification → the current user's notifications, newest first.
  getAll: () =>
    api.get<AppNotification[]>("/api/Notification").then((r) => r.data),

  // GET /api/Notification/unread-count → badge number.
  getUnreadCount: () =>
    api.get<number>("/api/Notification/unread-count").then((r) => r.data),

  // PUT /api/Notification/read → mark every notification read.
  markAllAsRead: () => api.put("/api/Notification/read").then((r) => r.data),
};
