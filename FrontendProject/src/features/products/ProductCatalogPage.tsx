import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "./products-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorState, PageLoader } from "@/components/states";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "newest" | "price-asc" | "price-desc" | "strength";

export function ProductCatalogPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((p) => p.tags?.forEach((t) => t && set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [data]);

  const products = useMemo(() => {
    let list = [...(data ?? [])];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTag) {
      list = list.filter((p) => p.tags?.includes(activeTag));
    }
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
  }, [data, search, sort, activeTag]);

  return (
    <div className="page-container">
      <PageHeader
        title={t("catalog.title")}
        description={t("catalog.desc")}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("catalog.searchPlaceholder")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
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

      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setActiveTag(null)}>
            <Badge tone={activeTag === null ? "info" : "neutral"} className="cursor-pointer">
              {t("catalog.all")}
            </Badge>
          </button>
          {tags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
              <Badge tone={activeTag === tag ? "info" : "neutral"} className="cursor-pointer">
                {tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <PageLoader label={t("catalog.loading")} />
      ) : isError ? (
        <ErrorState message={t("catalog.loadError")} onRetry={() => refetch()} />
      ) : products.length === 0 ? (
        <EmptyState
          title={t("catalog.noneTitle")}
          description={
            search || activeTag
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
