import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import { getToken } from "@/lib/token";

/**
 * Builds a SignalR connection to the backend NotificationHub ("/notificationHub").
 *
 * Unlike the chat hub there is no group to join: the server addresses people
 * directly with Clients.User(userId), resolved from the JWT's nameidentifier
 * claim. Connecting is the whole handshake.
 *
 * The hub is [Authorize]-protected; the WebSocket upgrade cannot carry headers,
 * so SignalR appends the token as an `access_token` query parameter, which
 * Program.cs reads for this path.
 *
 * Client callbacks: "ReceiveNotification" (AppNotification).
 */
export function createNotificationConnection(): HubConnection {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  return new HubConnectionBuilder()
    .withUrl(`${baseUrl}/notificationHub`, {
      accessTokenFactory: () => getToken() ?? "",
      transport:
        HttpTransportType.WebSockets |
        HttpTransportType.ServerSentEvents |
        HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}
