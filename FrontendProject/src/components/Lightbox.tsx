import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { mediaUrl } from "@/lib/format";
import { isVideo } from "@/components/ProductMedia";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface LightboxProps {
  items: string[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  alt?: string;
}

/** Fullscreen media viewer with keyboard + arrow navigation and a thumbnail rail. */
export function Lightbox({ items, index, open, onClose, onIndexChange, alt }: LightboxProps) {
  const { t } = useTranslation();
  const count = items.length;
  const altBase = alt ?? t("lightbox.mediaAlt");

  const go = useCallback(
    (dir: number) => {
      if (count === 0) return;
      onIndexChange((index + dir + count) % count);
    },
    [count, index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, go]);

  if (!open || count === 0) return null;

  const current = items[index];
  const resolved = mediaUrl(current);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-slate-950/95 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white/90">
        <span className="text-sm font-medium tabular-nums">
          {index + 1} / {count}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label={t("lightbox.close")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-16">
        {count > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
            aria-label={t("lightbox.previous")}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
          {isVideo(resolved) ? (
            <video
              src={resolved}
              className="max-h-[75vh] max-w-full rounded-lg"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={resolved}
              alt={`${altBase} ${index + 1}`}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
            />
          )}
        </div>

        {count > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
            aria-label={t("lightbox.next")}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Thumbnail rail */}
      {count > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 py-4 scrollbar-thin"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((m, i) => {
            const thumb = mediaUrl(m);
            return (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                className={cn(
                  "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  i === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                )}
                aria-label={t("lightbox.viewMedia", { n: i + 1 })}
              >
                {isVideo(thumb) ? (
                  <video src={thumb} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={thumb} alt={t("lightbox.thumbnail", { n: i + 1 })} className="h-full w-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
}
