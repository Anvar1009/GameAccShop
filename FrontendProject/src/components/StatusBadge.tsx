import { Badge } from "@/components/ui/badge";
import { orderStatusMeta, paymentStatusMeta } from "@/lib/enums";
import { useTranslation } from "@/i18n/useTranslation";

export function OrderStatusBadge({ value }: { value: number | string | null | undefined }) {
  const { t } = useTranslation();
  const meta = orderStatusMeta(value);
  return <Badge tone={meta.tone}>{t(meta.labelKey)}</Badge>;
}

export function PaymentStatusBadge({ value }: { value: number | string | null | undefined }) {
  const { t } = useTranslation();
  const meta = paymentStatusMeta(value);
  return <Badge tone={meta.tone}>{t(meta.labelKey)}</Badge>;
}
