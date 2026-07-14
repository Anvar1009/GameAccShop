import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/states";

/**
 * Full-page chat for a single order at /chat/:orderId. Order pages link here
 * and may pass { peerName, backTo } via router state for nicer context.
 */
export function ChatPage() {
  const { t } = useTranslation();
  const { orderId: rawId } = useParams();
  const orderId = Number(rawId);
  const location = useLocation();
  const state = (location.state ?? {}) as { peerName?: string; backTo?: string };

  if (!Number.isFinite(orderId) || orderId <= 0) {
    return (
      <div className="page-container">
        <ErrorState message={t("chat.invalidOrder")} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        to={state.backTo || "/orders"}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("chat.back")}
      </Link>

      <PageHeader
        title={t("chat.pageTitle")}
        description={t("chat.pageDesc")}
      />

      <div className="mx-auto max-w-2xl">
        <ChatPanel
          orderId={orderId}
          peerName={state.peerName}
          bodyHeight="h-[calc(100vh-22rem)] min-h-[320px]"
        />
      </div>
    </div>
  );
}
