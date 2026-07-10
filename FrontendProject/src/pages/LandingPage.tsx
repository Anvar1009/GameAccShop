import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, CreditCard, Gamepad2, ShieldCheck, Sparkles, Store } from "lucide-react";
import { useProducts } from "@/features/products/products-hooks";
import { useAuth } from "@/features/auth/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const steps: { icon: typeof Store; titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { icon: Store, titleKey: "landing.step1Title", textKey: "landing.step1Text" },
  { icon: CreditCard, titleKey: "landing.step2Title", textKey: "landing.step2Text" },
  { icon: ShieldCheck, titleKey: "landing.step3Title", textKey: "landing.step3Text" },
  { icon: BadgeCheck, titleKey: "landing.step4Title", textKey: "landing.step4Text" },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { data: products, isLoading } = useProducts();
  const featured = (products ?? []).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/60 to-background">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-sm font-medium text-primary shadow-soft">
              <Sparkles className="h-4 w-4" /> {t("landing.badge")}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {t("landing.heroTitle")} <span className="text-primary">{t("landing.heroHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  {t("landing.browseAccounts")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild size="lg" variant="outline">
                  <Link to="/register">{t("landing.startSelling")}</Link>
                </Button>
              )}
            </div>
            <div className="mt-10 flex flex-wrap gap-8">
              <Stat label={t("landing.statEscrow")} value="100%" />
              <Stat label={t("landing.statVerified")} value={t("landing.statVerifiedValue")} />
              <Stat label={t("landing.statFees")} value="$0" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[Gamepad2, ShieldCheck, CreditCard, BadgeCheck].map((Icon, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-6 shadow-card"
                  style={{ transform: i % 2 ? "translateY(1.5rem)" : undefined }}
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="mt-4 h-2 w-2/3 rounded-full bg-secondary" />
                  <div className="mt-2 h-2 w-1/2 rounded-full bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{t("landing.howItWorks")}</h2>
          <p className="mt-3 text-muted-foreground">
            {t("landing.howItWorksSub")}
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.titleKey} className="relative rounded-xl border border-border bg-card p-6 shadow-soft">
              <span className="absolute right-4 top-4 text-3xl font-bold text-secondary">
                {i + 1}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{t(step.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(step.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("landing.featured")}</h2>
              <p className="mt-1 text-muted-foreground">{t("landing.featuredSub")}</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/products">
                {t("landing.viewAll")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              {t("landing.emptyFeatured")}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
