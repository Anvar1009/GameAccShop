import { Check, Globe } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { LANGUAGES } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("lang.label")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current?.short ?? "UZ"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="justify-between"
          >
            <span>{lang.label}</span>
            <Check
              className={cn(
                "h-4 w-4 text-primary",
                lang.code === language ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
