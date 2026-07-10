import { Check } from "lucide-react";
import { OrderStatus } from "@/lib/enums";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const STEPS: { key: OrderStatus; labelKey: TranslationKey }[] = [
  { key: OrderStatus.WaitingPayment, labelKey: "timeline.step1" },
  { key: OrderStatus.PaymentConfirmed, labelKey: "timeline.step2" },
  { key: OrderStatus.BuyerConfirmed, labelKey: "timeline.step3" },
  { key: OrderStatus.Completed, labelKey: "timeline.step4" },
];

/** Maps the current order status onto a linear progress stepper. */
export function OrderTimeline({ status }: { status: number | string | null | undefined }) {
  const { t } = useTranslation();
  const current = typeof status === "number" ? status : Number(status);

  const rank = (s: OrderStatus): number => {
    // TransferInProgress sits between PaymentConfirmed and BuyerConfirmed.
    if (current === OrderStatus.Cancelled || current === OrderStatus.Disputed) return -1;
    if (current === OrderStatus.TransferInProgress && s <= OrderStatus.PaymentConfirmed) return 1;
    return current >= s ? 1 : 0;
  };

  const cancelled = current === OrderStatus.Cancelled;
  const disputed = current === OrderStatus.Disputed;

  if (cancelled || disputed) {
    return (
      <div
        className={cn(
          "rounded-lg border px-4 py-3 text-sm font-medium",
          cancelled
            ? "border-destructive/20 bg-destructive/5 text-destructive"
            : "border-warning/30 bg-warning/10 text-amber-700"
        )}
      >
        {cancelled ? t("timeline.cancelled") : t("timeline.disputed")}
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {STEPS.map((step, i) => {
        const done = rank(step.key) === 1;
        const isCurrent =
          current === step.key ||
          (current === OrderStatus.TransferInProgress && step.key === OrderStatus.PaymentConfirmed);
        return (
          <li key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className={cn("mt-1 h-8 w-0.5", done ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <div className="pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  done || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t(step.labelKey)}
              </p>
              {isCurrent && current === OrderStatus.TransferInProgress && (
                <p className="text-xs text-muted-foreground">{t("timeline.transferring")}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
