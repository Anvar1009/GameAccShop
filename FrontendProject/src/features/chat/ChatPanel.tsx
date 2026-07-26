import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  Lock,
  MessageCircle,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useChat } from "./chat-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/states";
import { cn } from "@/lib/utils";
import { formatDateTime, initials } from "@/lib/format";

interface ChatPanelProps {
  orderId: number;
  /** Name of the person on the other end, shown in the header. */
  peerName?: string;
  className?: string;
  /** Tailwind height for the scrollable message area. */
  bodyHeight?: string;
  /**
   * For viewers who aren't a participant on the conversation (e.g. an admin
   * reviewing a dispute): hides the composer and skips the live hub join /
   * read-receipts, which the backend only allows the buyer and seller to use.
   */
  readOnly?: boolean;
}

export function ChatPanel({
  orderId,
  peerName,
  className,
  bodyHeight = "h-80",
  readOnly = false,
}: ChatPanelProps) {
  const { t } = useTranslation();
  const {
    messages,
    connectionState,
    isLive,
    isClosed,
    typing,
    sending,
    sendMessage,
    notifyTyping,
    isLoading,
    isError,
  } = useChat(orderId, { readOnly });

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    try {
      await sendMessage(text);
    } catch {
      // Restore the draft so the user can retry.
      setDraft(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {peerName || t("chat.title")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("chat.orderRef", { id: orderId })}
            </p>
          </div>
        </div>
        {!readOnly && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isLive
                ? "bg-success/10 text-success"
                : "bg-secondary text-muted-foreground"
            )}
            title={
              isLive ? t("chat.liveConnected") : t("chat.liveDisconnected")
            }
          >
            {isLive ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {isLive
              ? t("chat.live")
              : connectionState === "connecting"
              ? t("chat.connecting")
              : t("chat.offline")}
          </span>
        )}
      </div>

      {/* Messages */}
      <div
        className={cn(
          "flex-1 space-y-3 overflow-y-auto scrollbar-thin bg-secondary/30 px-4 py-4",
          bodyHeight
        )}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("chat.loadError")}
          </p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <MessageCircle className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t("chat.empty")}</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex items-end gap-2",
                m.isMine ? "flex-row-reverse" : "flex-row"
              )}
            >
              {!m.isMine && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-primary">
                  {initials(m.senderName) || "?"}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-soft",
                  m.isMine
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-foreground",
                  m.pending && "opacity-70"
                )}
              >
                {!m.isMine && m.senderName && (
                  <p className="mb-0.5 text-xs font-semibold opacity-80">
                    {m.senderName}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p
                  className={cn(
                    "mt-1 flex items-center justify-end gap-1 text-[10px]",
                    m.isMine
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {m.pending ? t("chat.sending") : formatDateTime(m.createdAt)}
                  {m.isMine &&
                    (m.pending ? (
                      <Clock className="h-3 w-3" aria-label={t("chat.sending")} />
                    ) : m.isRead ? (
                      <CheckCheck
                        className="h-3.5 w-3.5 text-sky-300"
                        aria-label={t("chat.read")}
                      />
                    ) : (
                      <Check className="h-3.5 w-3.5" aria-label={t("chat.sent")} />
                    ))}
                </p>
              </div>
            </div>
          ))
        )}

        {typing && (
          <p className="text-xs italic text-muted-foreground">
            {t("chat.typing")}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      {!readOnly &&
        (isClosed ? (
          <div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0" />
            {t("chat.closed")}
          </div>
        ) : (
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  notifyTyping();
                }}
                onKeyDown={handleKeyDown}
                placeholder={t("chat.placeholder")}
                rows={1}
                className="max-h-32 min-h-[42px] resize-none"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!draft.trim() || sending}
                loading={sending}
                aria-label={t("chat.send")}
              >
                {!sending && <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
              {t("chat.hint")}
            </p>
          </div>
        ))}
    </div>
  );
}
