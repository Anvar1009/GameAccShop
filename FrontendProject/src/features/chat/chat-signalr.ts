import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import { getToken } from "@/lib/token";

/**
 * Builds a SignalR connection to the backend ChatHub (mapped at "/chatHub").
 *
 * The hub is [Authorize]-protected. On the negotiate request the JWT rides in
 * the Authorization header (via accessTokenFactory), but the WebSocket upgrade
 * cannot carry headers, so SignalR appends the token as an `access_token` query
 * parameter. The backend must read it for the WS transport to authenticate —
 * see the note in src/features/chat/README or the setup instructions.
 *
 * Hub methods (server): JoinConversation(conversationId), LeaveConversation(
 * conversationId), SendMessage({ orderId, text }), Typing(conversationId).
 * Client callbacks: "ReceiveMessage" (MessageResponse), "Typing" (no args).
 */
export function createChatConnection(): HubConnection {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  return new HubConnectionBuilder()
    .withUrl(`${baseUrl}/chatHub`, {
      accessTokenFactory: () => getToken() ?? "",
      // Prefer WebSockets; SignalR falls back to SSE / long-polling otherwise.
      transport:
        HttpTransportType.WebSockets |
        HttpTransportType.ServerSentEvents |
        HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}
