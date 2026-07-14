import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import type { ChatMessage } from "@/types/api";
import { useAuth } from "@/features/auth/useAuth";
import { chatApi } from "./chat-api";
import { createChatConnection } from "./chat-signalr";

export const chatKeys = {
  conversation: (orderId: number) => ["chat", "conversation", orderId] as const,
};

export type ChatConnectionState = "connecting" | "connected" | "disconnected";

/** Union two message lists by id, keeping chronological order. */
function mergeMessages(a: ChatMessage[], b: ChatMessage[]): ChatMessage[] {
  const byId = new Map<number, ChatMessage>();
  for (const m of a) byId.set(m.id, m);
  for (const m of b) byId.set(m.id, m);
  return Array.from(byId.values()).sort((x, y) => {
    const t = new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime();
    return t !== 0 ? t : x.id - y.id;
  });
}

/**
 * Drives a single order's conversation: loads history over REST, then layers a
 * live SignalR connection on top (join group, receive messages, typing).
 *
 * Resilience: if the hub cannot connect (e.g. the backend has not yet wired the
 * WebSocket `access_token` query handling), sending falls back to the REST
 * endpoint and history is polled every few seconds so the chat still works.
 */
export function useChat(orderId: number) {
  const { user } = useAuth();
  const currentUserId = user?.userId ?? null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] =
    useState<ChatConnectionState>("connecting");
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);

  const connectionRef = useRef<HubConnection | null>(null);
  const typingTimeout = useRef<number | undefined>(undefined);

  // Recompute `isMine` from the current user id — the hub broadcast leaves it
  // false for every recipient.
  const withMine = useCallback(
    (m: ChatMessage): ChatMessage => ({
      ...m,
      isMine: currentUserId != null ? m.senderId === currentUserId : m.isMine,
    }),
    [currentUserId]
  );

  const convQuery = useQuery({
    queryKey: chatKeys.conversation(orderId),
    queryFn: () => chatApi.getConversation(orderId),
    enabled: Number.isFinite(orderId) && orderId > 0,
    // Poll while the live connection is down so the other party's messages
    // still appear; the hub is authoritative once connected.
    refetchInterval: connectionState === "connected" ? false : 5000,
  });

  const conversationId = convQuery.data?.conversationId;

  // Seed / reconcile from the (re)fetched history without dropping live msgs.
  useEffect(() => {
    if (!convQuery.data) return;
    setMessages((prev) =>
      mergeMessages(prev, convQuery.data.messages.map(withMine))
    );
  }, [convQuery.data, withMine]);

  // Live SignalR connection, scoped to this conversation.
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    const connection = createChatConnection();
    connectionRef.current = connection;

    connection.on("ReceiveMessage", (msg: ChatMessage) => {
      setMessages((prev) => mergeMessages(prev, [withMine(msg)]));
      setTyping(false);
    });
    connection.on("Typing", () => {
      setTyping(true);
      window.clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => setTyping(false), 3000);
    });
    connection.onreconnecting(() => setConnectionState("connecting"));
    connection.onreconnected(async () => {
      try {
        await connection.invoke("JoinConversation", conversationId);
        setConnectionState("connected");
      } catch {
        setConnectionState("disconnected");
      }
    });
    connection.onclose(() => {
      if (!cancelled) setConnectionState("disconnected");
    });

    (async () => {
      try {
        await connection.start();
        if (cancelled) return;
        await connection.invoke("JoinConversation", conversationId);
        if (!cancelled) setConnectionState("connected");
      } catch {
        if (!cancelled) setConnectionState("disconnected");
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(typingTimeout.current);
      connection.off("ReceiveMessage");
      connection.off("Typing");
      if (connection.state === HubConnectionState.Connected) {
        connection.invoke("LeaveConversation", conversationId).catch(() => {});
      }
      connection.stop().catch(() => {});
      connectionRef.current = null;
    };
  }, [conversationId, withMine]);

  // Mark the other side's messages as read whenever a new one arrives.
  useEffect(() => {
    if (!conversationId) return;
    const hasIncoming = messages.some((m) => !m.isMine);
    if (hasIncoming) chatApi.markAsRead(conversationId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, messages.length]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        const conn = connectionRef.current;
        if (conn && conn.state === HubConnectionState.Connected) {
          // Hub re-broadcasts to the group (incl. us) → ReceiveMessage appends.
          await conn.invoke("SendMessage", { orderId, text: trimmed });
        } else {
          // REST persists but does not broadcast, so append locally.
          const saved = await chatApi.sendMessage({ orderId, text: trimmed });
          setMessages((prev) => mergeMessages(prev, [withMine(saved)]));
        }
      } finally {
        setSending(false);
      }
    },
    [orderId, withMine]
  );

  const notifyTyping = useCallback(() => {
    const conn = connectionRef.current;
    if (
      conn &&
      conn.state === HubConnectionState.Connected &&
      conversationId
    ) {
      conn.invoke("Typing", conversationId).catch(() => {});
    }
  }, [conversationId]);

  return {
    messages,
    conversationId,
    connectionState,
    isLive: connectionState === "connected",
    typing,
    sending,
    sendMessage,
    notifyTyping,
    isLoading: convQuery.isLoading,
    isError: convQuery.isError,
    refetch: convQuery.refetch,
  };
}
