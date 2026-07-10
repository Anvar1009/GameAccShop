import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useAdminPayments } from "./admin-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { PaymentStatusBadge } from "@/components/StatusBadge";
import { formatDate, formatPrice } from "@/lib/format";
import { PaymentStatus, paymentMethodKey } from "@/lib/enums";

type Filter = "all" | "pending" | "confirmed" | "released" | "cancelled";

const FILTER_TO_STATUS: Record<Exclude<Filter, "all">, PaymentStatus> = {
  pending: PaymentStatus.Pending,
  confirmed: PaymentStatus.Confirmed,
  released: PaymentStatus.Released,
  cancelled: PaymentStatus.Cancelled,
};

export function AdminPaymentsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useAdminPayments();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    let list = [...(data ?? [])].sort((a, b) => b.paymentId - a.paymentId);
    if (filter !== "all") {
      const status = FILTER_TO_STATUS[filter];
      list = list.filter((p) => Number(p.status) === status);
    }
    return list;
  }, [data, filter]);

  if (isLoading) return <PageLoader label={t("adminPayments.loading")} />;

  return (
    <div className="page-container">
      <PageHeader
        title={t("adminPayments.title")}
        description={t("adminPayments.desc")}
        actions={
          <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminPayments.allStatuses")}</SelectItem>
              <SelectItem value="pending">{t("adminPayments.pending")}</SelectItem>
              <SelectItem value="confirmed">{t("adminPayments.confirmed")}</SelectItem>
              <SelectItem value="released">{t("adminPayments.released")}</SelectItem>
              <SelectItem value="cancelled">{t("adminPayments.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("adminPayments.noneTitle")} description={t("adminPayments.noneDesc")} icon={CreditCard} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("adminPayments.headPayment")}</TableHead>
                <TableHead>{t("table.buyerToSeller")}</TableHead>
                <TableHead>{t("table.method")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-right">{t("table.amount")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.paymentId}>
                  <TableCell>
                    <span className="font-medium">#{p.paymentId}</span>
                    <span className="ml-1 text-xs text-muted-foreground">{t("order.orderRef", { id: p.orderId })}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.buyerName} → {p.sellerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t(paymentMethodKey(p.paymentMethod))}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                  <TableCell><PaymentStatusBadge value={p.status} /></TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(p.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/payments/${p.paymentId}`}>{t("common.review")}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
