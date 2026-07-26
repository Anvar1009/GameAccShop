import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileSearch,
  Gavel,
  ImagePlus,
  MessageSquareWarning,
  MessagesSquare,
  Paperclip,
  ShieldCheck,
  ShieldX,
  UserCheck,
} from "lucide-react";
import {
  useCloseDispute,
  useDisputeDetails,
  useRequestEvidence,
  useResolveBuyer,
  useResolveSeller,
  useStartReview,
  useUploadEvidence,
} from "./disputes-hooks";
import { useAuth } from "@/features/auth/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DisputeStatusBadge, OrderStatusBadge } from "@/components/StatusBadge";
import { ErrorState, PageLoader } from "@/components/states";
import { ProductMedia } from "@/components/ProductMedia";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { formatDateTime } from "@/lib/format";
import { DisputeStatus, isDisputeStatus } from "@/lib/enums";

const ALLOWED_EVIDENCE = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov"];
const MAX_EVIDENCE_SIZE = 20 * 1024 * 1024;

type ResolveKind = "buyer" | "seller" | null;

export function DisputeDetailsPage() {
  const { id: rawId } = useParams();
  const disputeId = Number(rawId);
  const { t } = useTranslation();
  const { isAdmin, user } = useAuth();
  const { data: dispute, isLoading, isError, refetch } = useDisputeDetails(disputeId);

  const startReview = useStartReview();
  const requestEvidence = useRequestEvidence();
  const resolveBuyer = useResolveBuyer();
  const resolveSeller = useResolveSeller();
  const closeDispute = useCloseDispute();
  const uploadEvidence = useUploadEvidence();

  const [resolveKind, setResolveKind] = useState<ResolveKind>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <PageLoader label={t("disputeDetails.loading")} />;
  if (isError || !dispute)
    return (
      <div className="page-container">
        <ErrorState message={t("disputeDetails.notFound")} onRetry={() => refetch()} />
      </div>
    );

  const isFinal =
    isDisputeStatus(dispute.status, DisputeStatus.ResolvedBuyer) ||
    isDisputeStatus(dispute.status, DisputeStatus.ResolvedSeller) ||
    isDisputeStatus(dispute.status, DisputeStatus.Closed);

  const canStartReview = !isFinal && !isDisputeStatus(dispute.status, DisputeStatus.UnderReview);
  const canRequestEvidence = !isFinal && !isDisputeStatus(dispute.status, DisputeStatus.WaitingEvidence);
  const canResolve = !isFinal;
  const canClose = !isDisputeStatus(dispute.status, DisputeStatus.Closed);
  const hasAnyAdminAction = canStartReview || canRequestEvidence || canResolve || canClose;

  const orderLink = isAdmin
    ? null
    : user?.userId === dispute.buyerId
    ? `/orders/${dispute.orderId}`
    : `/seller/orders/${dispute.orderId}`;

  const canUploadEvidence = !isAdmin && !isFinal;

  const handleEvidenceFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    for (const file of files) {
      const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_EVIDENCE.includes(ext)) {
        toast.error(t("toast.evidenceInvalidType"));
        return;
      }
      if (file.size > MAX_EVIDENCE_SIZE) {
        toast.error(t("toast.evidenceTooLarge"));
        return;
      }
    }

    uploadEvidence.mutate({ id: disputeId, files });
    if (evidenceInputRef.current) evidenceInputRef.current.value = "";
  };

  const openResolveDialog = (kind: ResolveKind) => {
    setAdminComment("");
    setResolveKind(kind);
  };

  const confirmResolve = async () => {
    if (resolveKind === "buyer") {
      await resolveBuyer.mutateAsync({
        id: disputeId,
        orderId: dispute.orderId,
        payload: { adminComment: adminComment.trim() || undefined },
      });
    } else if (resolveKind === "seller") {
      await resolveSeller.mutateAsync({
        id: disputeId,
        orderId: dispute.orderId,
        payload: { adminComment: adminComment.trim() || undefined },
      });
    }
    setResolveKind(null);
  };

  const confirmClose = async () => {
    await closeDispute.mutateAsync(disputeId);
    setCloseOpen(false);
  };

  const resolving = resolveBuyer.isPending || resolveSeller.isPending;

  return (
    <div className="page-container">
      <Link
        to={isAdmin ? "/admin/disputes" : "/disputes"}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back.disputes")}
      </Link>

      <PageHeader
        title={`${t("disputeDetails.title")} #${dispute.id}`}
        description={t("order.orderN", { id: dispute.orderId }) + " · " + formatDateTime(dispute.createdAt)}
        actions={
          <div className="flex items-center gap-2">
            <OrderStatusBadge value={dispute.orderStatus} />
            <DisputeStatusBadge value={dispute.status} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-primary" /> {t("disputeDetails.reason")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="whitespace-pre-wrap text-foreground">{dispute.reason}</p>
              <p className="text-xs text-muted-foreground">
                {t("disputeDetails.openedBy")}: {dispute.openedByName}
              </p>
            </CardContent>
          </Card>

          {dispute.adminComment && (
            <Card>
              <CardHeader>
                <CardTitle>{t("disputeDetails.adminComment")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="whitespace-pre-wrap text-foreground">{dispute.adminComment}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" /> {t("disputeDetails.evidence")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dispute.evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("disputeDetails.evidenceEmpty")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {dispute.evidence.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                        <ProductMedia src={item.url} alt={item.uploadedByName} className="h-full w-full" />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t("disputeDetails.uploadedBy", { name: item.uploadedByName })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {canUploadEvidence && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{t("disputeDetails.evidenceHint")}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      loading={uploadEvidence.isPending}
                      onClick={() => evidenceInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4" /> {t("disputeDetails.uploadEvidence")}
                    </Button>
                    <input
                      ref={evidenceInputRef}
                      type="file"
                      multiple
                      accept={ALLOWED_EVIDENCE.join(",")}
                      className="hidden"
                      onChange={(e) => handleEvidenceFiles(e.target.files)}
                    />
                    <p className="text-center text-xs text-muted-foreground">
                      {t("disputeDetails.evidenceTypes")}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessagesSquare className="h-5 w-5 text-primary" /> {t("disputeDetails.conversation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatPanel orderId={dispute.orderId} readOnly bodyHeight="h-72" />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("adminReview.account")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">
                {dispute.productDescription?.trim() || t("product.accountN", { id: dispute.productId })}
              </p>
              {orderLink && (
                <Button asChild variant="link" className="mt-1 h-auto p-0 text-sm">
                  <Link to={orderLink}>{t("disputeDetails.viewOrder")}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>{t("disputeDetails.adminActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canStartReview && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => startReview.mutate(disputeId)}
                    loading={startReview.isPending}
                  >
                    <FileSearch className="h-4 w-4" /> {t("disputeDetails.startReview")}
                  </Button>
                )}
                {canRequestEvidence && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => requestEvidence.mutate(disputeId)}
                    loading={requestEvidence.isPending}
                  >
                    <MessageSquareWarning className="h-4 w-4" /> {t("disputeDetails.requestEvidence")}
                  </Button>
                )}
                {canResolve && (
                  <>
                    <Button
                      variant="success"
                      className="w-full"
                      onClick={() => openResolveDialog("buyer")}
                    >
                      <UserCheck className="h-4 w-4" /> {t("disputeDetails.resolveBuyer")}
                    </Button>
                    <Button
                      variant="success"
                      className="w-full"
                      onClick={() => openResolveDialog("seller")}
                    >
                      <Gavel className="h-4 w-4" /> {t("disputeDetails.resolveSeller")}
                    </Button>
                  </>
                )}
                {canClose && (
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive/5"
                    onClick={() => setCloseOpen(true)}
                  >
                    <ShieldX className="h-4 w-4" /> {t("disputeDetails.close")}
                  </Button>
                )}
                {!hasAnyAdminAction && (
                  <p className="text-sm text-muted-foreground">{t("disputeDetails.noActions")}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("adminReview.parties")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("disputeDetails.buyer")}
                </p>
                <p className="font-medium">{dispute.buyerName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("disputeDetails.seller")}
                </p>
                <p className="font-medium">{dispute.sellerName}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("disputeDetails.createdAt")}</span>
                <span className="font-medium">{formatDateTime(dispute.createdAt)}</span>
              </div>
              {dispute.resolvedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("disputeDetails.resolvedAt")}</span>
                  <span className="font-medium">{formatDateTime(dispute.resolvedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={resolveKind !== null} onOpenChange={(o) => !o && setResolveKind(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resolveKind === "buyer"
                ? t("disputeDetails.resolveBuyerDialogTitle")
                : t("disputeDetails.resolveSellerDialogTitle")}
            </DialogTitle>
            <DialogDescription>
              {resolveKind === "buyer"
                ? t("disputeDetails.resolveBuyerDialogDesc")
                : t("disputeDetails.resolveSellerDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="adminComment">{t("disputeDetails.adminCommentLabel")}</Label>
            <Textarea
              id="adminComment"
              placeholder={t("disputeDetails.adminCommentPlaceholder")}
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveKind(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="success" onClick={confirmResolve} loading={resolving}>
              <ShieldCheck className="h-4 w-4" />
              {resolveKind === "buyer" ? t("disputeDetails.resolveBuyer") : t("disputeDetails.resolveSeller")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("disputeDetails.closeDialogTitle")}</DialogTitle>
            <DialogDescription>{t("disputeDetails.closeDialogDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmClose} loading={closeDispute.isPending}>
              {t("disputeDetails.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
