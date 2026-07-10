import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  FileUp,
  Hourglass,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { usePaymentDetails, useUploadReceipt } from "./buyer-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ErrorState, PageLoader } from "@/components/states";
import { PaymentStatusBadge } from "@/components/StatusBadge";
import { formatPrice } from "@/lib/format";
import { PaymentStatus, isPaymentStatus, paymentMethodKey } from "@/lib/enums";

const ALLOWED = [".jpg", ".jpeg", ".png", ".pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

export function PaymentPage() {
  const { orderId: rawId } = useParams();
  const orderId = Number(rawId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: payment, isLoading, isError, refetch } = usePaymentDetails(orderId);
  const uploadReceipt = useUploadReceipt();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <PageLoader label={t("payment.loading")} />;
  if (isError || !payment)
    return (
      <div className="page-container">
        <ErrorState message={t("payment.loadError")} onRetry={() => refetch()} />
      </div>
    );

  const isPending = isPaymentStatus(payment.status, PaymentStatus.Pending);

  const pickFile = (f: File | null) => {
    if (!f) return;
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED.includes(ext)) {
      toast.error(t("payment.onlyAllowed"));
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error(t("payment.tooLarge"));
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    await uploadReceipt.mutateAsync({ orderId, paymentId: payment.paymentId, receipt: file });
    setFile(null);
    navigate(`/orders/${orderId}`);
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast.success(t("payment.copied")),
      () => toast.error(t("payment.copyFailed"))
    );
  };

  return (
    <div className="page-container max-w-4xl">
      <Link
        to={`/orders/${orderId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back.order")}
      </Link>

      <PageHeader
        title={t("payment.title")}
        description={t("payment.desc")}
        actions={<PaymentStatusBadge value={payment.status} />}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> {t("payment.transferTo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-500 p-5 text-primary-foreground shadow-card">
              <p className="text-xs uppercase tracking-wide text-primary-foreground/70">
                {payment.name || t("payment.accountFallback")}
              </p>
              <button
                onClick={() => copy(payment.cardNumber)}
                className="mt-3 flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="font-mono text-xl tracking-wider">{payment.cardNumber}</span>
                <Copy className="h-4 w-4 shrink-0 opacity-80" />
              </button>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <User className="h-4 w-4 opacity-80" />
                <span>{payment.ownerName}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Row icon={Building2} label={t("payment.provider")} value={payment.name} />
              <Row label={t("payment.method")} value={t(paymentMethodKey(payment.paymentMethod))} />
              <Separator />
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">{t("payment.amountToPay")}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(payment.amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" /> {t("payment.uploadReceipt")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isPending ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  {isPaymentStatus(payment.status, PaymentStatus.Confirmed) ||
                  isPaymentStatus(payment.status, PaymentStatus.Released) ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <Hourglass className="h-6 w-6 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t("payment.receiptSubmitted")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("payment.receiptSubmittedDesc")}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link to={`/orders/${orderId}`}>{t("payment.viewOrderStatus")}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    pickFile(e.dataTransfer.files?.[0] ?? null);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-4 py-10 text-center transition-colors hover:border-primary hover:bg-accent/40"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  {file ? (
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} KB · {t("payment.clickToChange")}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t("payment.dropReceipt")}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("payment.fileTypes")}</p>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ALLOWED.join(",")}
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!file}
                  loading={uploadReceipt.isPending}
                  onClick={handleUpload}
                >
                  {t("payment.submitReceipt")}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {t("payment.afterSubmit")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
