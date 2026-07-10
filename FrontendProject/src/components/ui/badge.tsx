import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeTone } from "@/lib/enums";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-border bg-secondary text-secondary-foreground",
        info: "border-primary/20 bg-accent text-accent-foreground",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-amber-700",
        danger: "border-destructive/20 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: BadgeTone;
}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
