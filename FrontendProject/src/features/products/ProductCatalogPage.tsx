import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, Tag as TagIcon, Wallet, Zap } from "lucide-react";
import { useProducts } from "./products-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RangeSlider } from "@/components/RangeSlider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "price-asc" | "price-desc" | "strength";
type Range = [number, number];

const HISTOGRAM_BUCKETS = 20;
const ALL_TAGS = "all";

function bounds(values: number[]): Range {
  if (values.length === 0) return [0, 0];
  return [Math.min(...values), Math.max(...values)];
}

function buildHistogram(values: number[], [min, max]: Range, buckets = HISTOGRAM_BUCKETS): number[] {
  const span = Math.max(max - min, 1);
  const counts = new Array(buckets).fill(0);
  for (const v of values) {
    const index = Math.min(buckets - 1, Math.max(0, Math.floor(((v - min) / span) * buckets)));
    counts[index] += 1;
  }
  return counts;
}

function niceStep(span: number): number {
  return Math.max(1, Math.round(span / 200));
}

export function ProductCatalogPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<Range | null>(null);
  const [strengthRange, setStrengthRange] = useState<Range | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((p) => p.tags?.forEach((tg) => tg && set.add(tg)));
    return Array.from(set).slice(0, 12);
  }, [data]);

  const priceBounds = useMemo(() => bounds((data ?? []).map((p) => p.accPrice)), [data]);
  const strengthBounds = useMemo(() => bounds((data ?? []).map((p) => p.accStrength)), [data]);

  const priceHistogram = useMemo(
    () => buildHistogram((data ?? []).map((p) => p.accPrice), priceBounds),
    [data, priceBounds]
  );
  const strengthHistogram = useMemo(
    () => buildHistogram((data ?? []).map((p) => p.accStrength), strengthBounds),
    [data, strengthBounds]
  );

  const effectivePriceRange = priceRange ?? priceBounds;
  const effectiveStrengthRange = strengthRange ?? strengthBounds;
  const isPriceFiltered = priceRange != null;
  const isStrengthFiltered = strengthRange != null;

  const products = useMemo(() => {
    let list = [...(data ?? [])];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((tg) => tg.toLowerCase().includes(q))
      );
    }
    if (activeTag) {
      list = list.filter((p) => p.tags?.includes(activeTag));
    }
    list = list.filter(
      (p) => p.accPrice >= effectivePriceRange[0] && p.accPrice <= effectivePriceRange[1]
    );
    list = list.filter(
      (p) => p.accStrength >= effectiveStrengthRange[0] && p.accStrength <= effectiveStrengthRange[1]
    );
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.accPrice - b.accPrice);
        break;
      case "price-desc":
        list.sort((a, b) => b.accPrice - a.accPrice);
        break;
      case "strength":
        list.sort((a, b) => b.accStrength - a.accStrength);
        break;
      default:
        list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [data, search, sort, activeTag, effectivePriceRange, effectiveStrengthRange]);

  return (
    <div className="page-container">
      <PageHeader
        title={t("catalog.title")}
        description={t("catalog.desc")}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("catalog.searchPlaceholder")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tag filter */}
        {tags.length > 0 && (
          <Select
            value={activeTag ?? ALL_TAGS}
            onValueChange={(v) => setActiveTag(v === ALL_TAGS ? null : v)}
          >
            <SelectTrigger className={cn("w-[150px]", activeTag && "border-primary/50 text-primary")}>
              <TagIcon className="h-4 w-4 shrink-0 opacity-70" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TAGS}>{t("catalog.all")}</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Price range filter */}
        {priceBounds[1] > priceBounds[0] && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(isPriceFiltered && "border-primary/50 bg-accent/40 text-primary")}
              >
                <Wallet className="h-4 w-4" />
                {isPriceFiltered
                  ? `${formatPrice(effectivePriceRange[0])} – ${formatPrice(effectivePriceRange[1])}`
                  : t("catalog.priceRange")}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <RangeSlider
                label={t("catalog.priceRange")}
                min={priceBounds[0]}
                max={priceBounds[1]}
                step={niceStep(priceBounds[1] - priceBounds[0])}
                value={effectivePriceRange}
                onValueChange={setPriceRange}
                histogram={priceHistogram}
                formatValue={formatPrice}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Strength range filter */}
        {strengthBounds[1] > strengthBounds[0] && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(isStrengthFiltered && "border-primary/50 bg-accent/40 text-primary")}
              >
                <Zap className="h-4 w-4" />
                {isStrengthFiltered
                  ? `${formatNumber(effectiveStrengthRange[0])} – ${formatNumber(effectiveStrengthRange[1])}`
                  : t("catalog.strengthRange")}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <RangeSlider
                label={t("catalog.strengthRange")}
                min={strengthBounds[0]}
                max={strengthBounds[1]}
                step={niceStep(strengthBounds[1] - strengthBounds[0])}
                value={effectiveStrengthRange}
                onValueChange={setStrengthRange}
                histogram={strengthHistogram}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("catalog.sortNewest")}</SelectItem>
              <SelectItem value="price-asc">{t("catalog.sortPriceAsc")}</SelectItem>
              <SelectItem value="price-desc">{t("catalog.sortPriceDesc")}</SelectItem>
              <SelectItem value="strength">{t("catalog.sortStrongest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <PageLoader label={t("catalog.loading")} />
      ) : isError ? (
        <ErrorState message={t("catalog.loadError")} onRetry={() => refetch()} />
      ) : products.length === 0 ? (
        <EmptyState
          title={t("catalog.noneTitle")}
          description={
            search || activeTag || priceRange || strengthRange
              ? t("catalog.noneDescFiltered")
              : t("catalog.noneDesc")
          }
          icon={Search}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
