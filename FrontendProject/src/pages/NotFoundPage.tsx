import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {t("notFound.desc")}
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4" /> {t("notFound.goHome")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/products">
            <Search className="h-4 w-4" /> {t("notFound.browse")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
