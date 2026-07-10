import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAdminOrders } from "./admin-hooks";
import { PageHeader } from "@/components/PageHeader";
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
import { OrderStatusBadge } from "@/components/StatusBadge";
import { useTranslation } from "@/i18n/useTranslation";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatus, orderStatusMeta } from "@/lib/enums";

const STATUS_OPTIONS = [
  OrderStatus.WaitingPayment,
  OrderStatus.PaymentConfirmed,
  OrderStatus.TransferInProgress,
  OrderStatus.BuyerConfirmed,
  OrderStatus.Completed,
  OrderStatus.Cancelled,
  OrderStatus.Disputed,
];

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useAdminOrders();
  const [filter, setFilter] = useState<string>("all");

  const rows = useMemo(() => {
    let list = [...(data ?? [])].sort((a, b) => b.orderId - a.orderId);
    if (filter !== "all") list = list.filter((o) => Number(o.status) === Number(filter));
    return list;
  }, [data, filter]);

  if (isLoading) return <PageLoader label={t("adminOrders.loading")} />;

  return (
    <div className="page-container">
      <PageHeader
        title={t("adminOrders.title")}
        description={t("adminOrders.desc")}
        actions={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminOrders.allStatuses")}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {t(orderStatusMeta(s).labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isError ? (
        <ErrorState
          title={t("adminOrders.loadErrorTitle")}
          message={
            (error as { response?: { status?: number } })?.response?.status === 403
              ? t("adminOrders.error403")
              : t("adminOrders.errorGeneric")
          }
          onRetry={() => refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState title={t("adminOrders.noneTitle")} description={t("adminOrders.noneDesc")} icon={ClipboardList} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.order")}</TableHead>
                <TableHead>{t("table.buyer")}</TableHead>
                <TableHead>{t("table.seller")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-right">{t("table.price")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.orderId}>
                  <TableCell>
                    <span className="font-medium">#{o.orderId}</span>
                    <span className="ml-1 text-xs text-muted-foreground">{t("adminOrders.productN", { id: o.productId })}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.buyerName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.sellerName}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                  <TableCell><OrderStatusBadge value={o.status} /></TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(o.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
