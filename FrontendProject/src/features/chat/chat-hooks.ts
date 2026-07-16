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

/**
 * A message as rendered: either persisted (positive id, from REST or the hub)
 * or optimistic — shown the instant the user hits send, with a temporary
 * negative id, until its server copy arrives.
 */
export type ChatMessageView = ChatMessage & {
  pending?: boolean;
  /**
   * Highest persisted id present when an optimistic bubble was created. Only a
   * message newer than this can be its server copy, so sending the same text
   * twice pairs each bubble with the right one.
   */
  afterId?: number;
};

let tempIdSeq = 0;
const nextTempId = () => --tempIdSeq;

/**
 * Union the current list with freshly received messages, dropping optimistic
 * entries once their persisted copy shows up (matched on sender + text, one
 * server message per pending bubble so repeated texts stay intact).
 */
function mergeMessages(
  current: ChatMessageView[],
  incoming: ChatMessage[]
): ChatMessageView[] {
  const byId = new Map<number, ChatMessageView>();
  const pending: ChatMessageView[] = [];
  for (const m of current) {
    if (m.pending) pending.push(m);
    else byId.set(m.id, m);
  }
  for (const m of incoming) {
    const known = byId.get(m.id);
    // A message never goes back to unread: a refetch that raced a "MessagesRead"
    // event would otherwise clear the ticks we just lit.
    byId.set(m.id, known?.isRead ? { ...m, isRead: true } : m);
  }

  const confirmed = Array.from(byId.values());
  const claimed = new Set<number>();
  const stillPending = pending.filter((p) => {
    const match = confirmed.find(
      (c) =>
        !claimed.has(c.id) &&
        c.id > (p.afterId ?? 0) &&
        c.senderId === p.senderId &&
        c.text === p.text
    );
    if (!match) return true;
    claimed.add(match.id);
    return false;
  });

  return [...confirmed, ...stillPending].sort((x, y) => {
    const t = new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime();
    if (t !== 0) return t;
    // Optimistic bubbles always trail their peers at the same timestamp.
    if (!!x.pending !== !!y.pending) return x.pending ? 1 : -1;
    return x.id - y.id;
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

  const [messages, setMessages] = useState<ChatMessageView[]>([]);
  const [connectionState, setConnectionState] =
    useState<ChatConnectionState>("connecting");
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);

  const connectionRef = useRef<HubConnection | null>(null);
  const typingTimeout = useRef<number | undefined>(undefined);
  const lastTypingSent = useRef(0);
  const reconcileTimeouts = useRef(new Set<number>());

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

  const refetchRef = useRef(convQuery.refetch);
  refetchRef.current = convQuery.refetch;

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Drop scheduled reconcile refetches if the panel unmounts first.
  useEffect(() => {
    const timeouts = reconcileTimeouts.current;
    return () => {
      for (const handle of timeouts) window.clearTimeout(handle);
      timeouts.clear();
    };
  }, []);

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
    // The other side opened the chat: light up the ticks on everything we sent.
    connection.on("MessagesRead", (_convId: number, readerId: number) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId !== readerId && !m.isRead ? { ...m, isRead: true } : m
        )
      );
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
      connection.off("MessagesRead");
      if (connection.state === HubConnectionState.Connected) {
        connection.invoke("LeaveConversation", conversationId).catch(() => {});
      }
      connection.stop().catch(() => {});
      connectionRef.current = null;
    };
  }, [conversationId, withMine]);

  const unreadIncoming = messages.reduce(
    (n, m) => (!m.isMine && !m.isRead ? n + 1 : n),
    0
  );

  // Reading the other side's messages: over the hub when it is up, so the
  // sender's ticks flip live; the REST endpoint broadcasts the same event.
  useEffect(() => {
    if (!conversationId || unreadIncoming === 0) return;
    let cancelled = false;

    (async () => {
      try {
        const conn = connectionRef.current;
        if (conn && conn.state === HubConnectionState.Connected) {
          await conn.invoke("MarkAsRead", conversationId);
        } else {
          await chatApi.markAsRead(conversationId);
        }
        if (cancelled) return;
        // Settle locally so this does not re-fire on every render.
        setMessages((prev) =>
          prev.map((m) => (!m.isMine && !m.isRead ? { ...m, isRead: true } : m))
        );
      } catch {
        // Left unread; the next incoming message retries.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, unreadIncoming]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Show the message straight away; the server copy replaces it on arrival.
      const optimistic: ChatMessageView = {
        id: nextTempId(),
        senderId: currentUserId ?? -1,
        conversationId: conversationId ?? 0,
        senderName: user?.login ?? "",
        text: trimmed,
        isMine: true,
        isRead: false,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => {
        const afterId = prev.reduce(
          (max, m) => (m.pending ? max : Math.max(max, m.id)),
          0
        );
        return mergeMessages([...prev, { ...optimistic, afterId }], []);
      });
      setSending(true);

      try {
        const conn = connectionRef.current;
        if (conn && conn.state === HubConnectionState.Connected) {
          await conn.invoke("SendMessage", { orderId, text: trimmed });
          // The hub broadcasts to the group, but it may not echo back to the
          // sender's own connection — pull the persisted copy so the bubble
          // stops being optimistic and picks up its real id/timestamp.
          const handle = window.setTimeout(() => {
            reconcileTimeouts.current.delete(handle);
            const echoed = !messagesRef.current.some(
              (m) => m.id === optimistic.id
            );
            if (!echoed) void refetchRef.current();
          }, 800);
          reconcileTimeouts.current.add(handle);
        } else {
          // REST persists but does not broadcast, so append locally.
          const saved = await chatApi.sendMessage({ orderId, text: trimmed });
          setMessages((prev) => mergeMessages(prev, [withMine(saved)]));
        }
      } catch (err) {
        // Drop the bubble so the composer can restore the draft for a retry.
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        throw err;
      } finally {
        setSending(false);
      }
    },
    [orderId, withMine, conversationId, currentUserId, user?.login]
  );

  const notifyTyping = useCallback(() => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== HubConnectionState.Connected || !conversationId)
      return;
    // The peer's indicator lives for 3s, so one ping per second is plenty —
    // without this every keystroke would hit the hub.
    const now = Date.now();
    if (now - lastTypingSent.current < 1000) return;
    lastTypingSent.current = now;
    conn.invoke("Typing", conversationId).catch(() => {});
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
