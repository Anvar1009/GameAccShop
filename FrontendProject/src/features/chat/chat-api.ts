import { api } from "@/lib/api";
import type { ChatConversation, ChatMessage, SendChatMessage } from "@/types/api";

/**
 * REST surface for the chat feature (backend: ChatController). The realtime
 * transport lives in chat-signalr.ts; these endpoints load history, mark
 * messages read, and act as a send fallback when the SignalR hub is down.
 */
export const chatApi = {
  // GET /api/Chat/{orderId} → conversation (id + messages) for an order.
  getConversation: (orderId: number) =>
    api.get<ChatConversation>(`/api/Chat/${orderId}`).then((r) => r.data),

  // GET /api/Chat/{conversationId}/messages → full message history.
  getMessages: (conversationId: number) =>
    api
      .get<ChatMessage[]>(`/api/Chat/${conversationId}/messages`)
      .then((r) => r.data),

  // POST /api/Chat → persist a message (used when the hub is not connected).
  sendMessage: (payload: SendChatMessage) =>
    api.post<ChatMessage>("/api/Chat", payload).then((r) => r.data),

  // PUT /api/Chat/{conversationId}/ReadMessage → mark the other side's
  // messages as read.
  markAsRead: (conversationId: number) =>
    api.put(`/api/Chat/${conversationId}/ReadMessage`).then((r) => r.data),

  // GET /api/Chat/{conversationId}/UnReadMessageCount → unread count.
  getUnreadCount: (conversationId: number) =>
    api
      .get<number>(`/api/Chat/${conversationId}/UnReadMessageCount`)
      .then((r) => r.data),
};
