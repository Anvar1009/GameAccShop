import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useMyDisputes } from "./disputes-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/format";

export function DisputesPage() {
  const { t } = useTranslation();
  const { data: disputes, isLoading, isError, refetch } = useMyDisputes();

  if (isLoading) return <PageLoader label={t("disputes.loading")} />;

  const list = [...(disputes ?? [])].sort((a, b) => b.id - a.id);

  return (
    <div className="page-container">
      <PageHeader title={t("disputes.myTitle")} description={t("disputes.myDesc")} />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          title={t("disputes.noneTitle")}
          description={t("disputes.noneDesc")}
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
              {list.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{t("order.orderN", { id: d.orderId })}</TableCell>
                  <TableCell className="text-muted-foreground">{d.openedByName}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-muted-foreground">{d.reason}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(d.createdAt)}</TableCell>
                  <TableCell><DisputeStatusBadge value={d.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/disputes/${d.id}`}>{t("disputes.view")}</Link>
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
