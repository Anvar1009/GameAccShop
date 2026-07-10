import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { mediaUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

const VIDEO_RE = /\.(mp4|webm|mov|avi|mkv)$/i;

export function isVideo(url?: string | null) {
  return !!url && VIDEO_RE.test(url);
}

/** Renders a single media item (image or video) with a graceful fallback. */
export function ProductMedia({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const resolved = mediaUrl(src);

  if (!resolved || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-secondary to-accent text-muted-foreground",
          className
        )}
      >
        <Gamepad2 className="h-10 w-10 opacity-40" />
      </div>
    );
  }

  if (isVideo(resolved)) {
    return (
      <video
        src={resolved}
        className={cn("object-cover", className)}
        muted
        loop
        playsInline
        controls
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      className={cn("object-cover", className)}
      onError={() => setErrored(true)}
    />
  );
}
