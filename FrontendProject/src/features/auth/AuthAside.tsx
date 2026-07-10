import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translations";

const pointKeys: TranslationKey[] = ["authAside.point1", "authAside.point2", "authAside.point3"];

export function AuthAside() {
  const { t } = useTranslation();
  return (
    <div className="relative hidden overflow-hidden bg-primary lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative flex h-full flex-col justify-center px-12 text-primary-foreground">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
          <ShieldCheck className="h-4 w-4" />
          {t("authAside.badge")}
        </div>
        <h2 className="max-w-md text-3xl font-bold leading-tight">
          {t("authAside.title")}
        </h2>
        <p className="mt-4 max-w-md text-primary-foreground/80">
          {t("authAside.desc")}
        </p>
        <ul className="mt-8 space-y-3">
          {pointKeys.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <span className="text-sm text-primary-foreground/90">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
