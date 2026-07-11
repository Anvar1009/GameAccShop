import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/ThemeContext";
import { useTranslation } from "@/i18n/useTranslation";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t("theme.toggle")}
      title={isDark ? t("theme.light") : t("theme.dark")}
    >
      {isDark ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" />
      )}
    </button>
  );
}
