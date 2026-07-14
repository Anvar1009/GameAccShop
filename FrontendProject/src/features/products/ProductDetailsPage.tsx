import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Coins, Expand, Lock, MessageCircle, ShieldCheck, ShoppingCart, Users, Zap } from "lucide-react";
import { useProduct } from "./products-hooks";
import { useAuth } from "@/features/auth/useAuth";
import { useBuyerOrders, useCreateOrder } from "@/features/buyer/buyer-hooks";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductMedia } from "@/components/ProductMedia";
import { Lightbox } from "@/components/Lightbox";
import { ErrorState, PageLoader } from "@/components/states";
import { formatNumber, formatPrice } from "@/lib/format";

export function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const createOrder = useCreateOrder();
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleBuy = async () => {
    const res = await createOrder.mutateAsync(productId);
    navigate(`/payment/${res.orderId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <BackLink />
        <Card className="mx-auto mt-6 max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t("productDetails.signInTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("productDetails.signInDesc")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/login" state={{ from: { pathname: `/products/${productId}` } }}>
                  {t("productDetails.signIn")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">{t("productDetails.createAccount")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <PageLoader label={t("productDetails.loading")} />;
  if (isError || !product)
    return (
      <div className="page-container">
        <BackLink />
        <ErrorState message={t("productDetails.loadError")} onRetry={() => refetch()} />
      </div>
    );

  const medias = product.medias ?? [];
  const tags = Array.from(new Set(product.tags ?? []));

  return (
    <div className="page-container">
      <BackLink />

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => medias.length > 0 && setLightboxOpen(true)}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in bg-secondary"
              aria-label={t("productDetails.openViewer")}
            >
              <ProductMedia
                src={medias[active]}
                alt={product.description || t("product.gameAccount")}
                className="h-full w-full"
              />
              {medias.length > 0 && (
                <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" /> {t("product.view")}
                </span>
              )}
            </button>
          </Card>
          {medias.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
              {medias.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  onDoubleClick={() => setLightboxOpen(true)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    active === i ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                  title={t("productDetails.clickPreview")}
                >
                  <ProductMedia src={m} alt={t("productDetails.previewAlt", { n: i + 1 })} className="h-full w-full" />
                </button>
              ))}
            </div>
          )}

          <Lightbox
            items={medias}
            index={active}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={setActive}
            alt={product.description || t("product.gameAccount")}
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <Badge key={`${t}-${i}`} tone="info">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            {product.description?.trim() || t("product.gameAccountN", { id: product.id })}
          </h1>
          <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(product.accPrice)}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Spec icon={Zap} label={t("product.strength")} value={formatNumber(product.accStrength)} />
            <Spec icon={Coins} label={t("product.coins")} value={formatNumber(product.coinsCount)} />
            <Spec icon={Users} label={t("product.players")} value={formatNumber(product.playerCount)} />
          </div>

          {product.description?.trim() && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("productDetails.description")}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {product.description}
              </p>
            </div>
          )}

          <Separator className="my-6" />

          <div className="rounded-xl border border-border bg-accent/40 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{t("productDetails.protectedTitle")}</p>
                <p className="text-muted-foreground">
                  {t("productDetails.protectedDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isAdmin ? (
              <p className="text-sm text-muted-foreground">
                {t("productDetails.adminDisabled")}
              </p>
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={handleBuy}
                loading={createOrder.isPending}
              >
                <ShoppingCart className="h-5 w-5" />
                {t("productDetails.buyNow", { price: formatPrice(product.accPrice) })}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat with the seller (order-scoped). */}
      {!isAdmin && <ProductChatSection productId={productId} />}
    </div>
  );
}

function ProductChatSection({ productId }: { productId: number }) {
  const { t } = useTranslation();
  const { data: orders } = useBuyerOrders();

  // Chat is tied to an order between this buyer and the seller. Surface the
  // most recent order the current user has for this product, if any.
  const related = (orders ?? []).filter((o) => o.productId === productId);
  const order = related.length ? related[related.length - 1] : null;

  return (
    <section className="mx-auto mt-10 max-w-2xl">
      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t("chat.sellerHeading")}</h2>
      </div>

      {order ? (
        <ChatPanel orderId={order.orderId} peerName={order.sellerName} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("chat.availableAfterOrder")}
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function BackLink() {
  const { t } = useTranslation();
  return (
    <Link
      to="/products"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> {t("back.catalog")}
    </Link>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center shadow-soft">
      <Icon className="mx-auto h-5 w-5 text-primary" />
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
