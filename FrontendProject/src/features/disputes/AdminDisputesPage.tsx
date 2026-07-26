import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAllDisputes } from "./disputes-hooks";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { DisputeStatusBadge } from "@/components/StatusBadge";
import { useTranslation } from "@/i18n/useTranslation";
import { formatDate } from "@/lib/format";
import { DisputeStatus, disputeStatusMeta } from "@/lib/enums";

const STATUS_OPTIONS = [
  DisputeStatus.Open,
  DisputeStatus.UnderReview,
  DisputeStatus.WaitingEvidence,
  DisputeStatus.ResolvedBuyer,
  DisputeStatus.ResolvedSeller,
  DisputeStatus.Closed,
];

export function AdminDisputesPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useAllDisputes();
  const [filter, setFilter] = useState<string>("all");

  const rows = useMemo(() => {
    let list = [...(data ?? [])].sort((a, b) => b.id - a.id);
    if (filter !== "all") list = list.filter((d) => Number(d.status) === Number(filter));
    return list;
  }, [data, filter]);

  if (isLoading) return <PageLoader label={t("adminDisputes.loading")} />;

  return (
    <div className="page-container">
      <PageHeader
        title={t("adminDisputes.title")}
        description={t("adminDisputes.desc")}
        actions={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminDisputes.allStatuses")}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {t(disputeStatusMeta(s).labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("adminDisputes.noneTitle")}
          description={t("adminDisputes.noneDesc")}
          icon={ShieldAlert}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.order")}</TableHead>
                <TableHead>{t("disputes.openedBy")}</TableHead>
                <TableHead>{t("disputeDetails.reason")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{t("order.orderN", { id: d.orderId })}</TableCell>
                  <TableCell className="text-muted-foreground">{d.openedByName}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-muted-foreground">{d.reason}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(d.createdAt)}</TableCell>
                  <TableCell><DisputeStatusBadge value={d.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/disputes/${d.id}`}>{t("common.review")}</Link>
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
