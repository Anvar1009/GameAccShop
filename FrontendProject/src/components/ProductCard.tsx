import { Link } from "react-router-dom";
import { Coins, Users, Zap } from "lucide-react";
import type { Product } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductMedia } from "@/components/ProductMedia";
import { formatNumber, formatPrice } from "@/lib/format";
import { useTranslation } from "@/i18n/useTranslation";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const tags = Array.from(new Set(product.tags ?? []));
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductMedia
          src={product.medias?.[0]}
          alt={product.description || t("product.gameAccount")}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
        <div className="absolute right-3 top-3">
          <Badge className="border-0 bg-brand-gradient text-primary-foreground shadow-glow-sm">
            {formatPrice(product.accPrice)}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="line-clamp-1 font-semibold text-foreground">
            {product.description?.trim() || t("product.gameAccountN", { id: product.id })}
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat icon={Zap} label={t("product.strength")} value={formatNumber(product.accStrength)} />
            <Stat icon={Coins} label={t("product.coins")} value={formatNumber(product.coinsCount)} />
            <Stat icon={Users} label={t("product.players")} value={formatNumber(product.playerCount)} />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge key={`${tag}-${i}`} tone="neutral">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && <Badge tone="neutral">+{tags.length - 3}</Badge>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.accPrice)}</span>
          <Button asChild size="sm">
            <Link to={`/products/${product.id}`}>{t("product.view")}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/50 px-1.5 py-2 transition-colors group-hover:border-primary/30">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
