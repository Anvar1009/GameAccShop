import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useTranslation } from "@/i18n/useTranslation";

export function AppLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-xs">{t("footer.tagline")}</p>
        </div>
      </footer>
    </div>
  );
}
