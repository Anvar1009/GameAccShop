import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneStyles: Record<string, string> = {
  primary: "bg-primary/15 text-primary ring-1 ring-inset ring-primary/25",
  success: "bg-success/15 text-success ring-1 ring-inset ring-success/25",
  warning: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/25",
  danger: "bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/25",
  neutral: "bg-secondary text-muted-foreground",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tone?: keyof typeof toneStyles;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
