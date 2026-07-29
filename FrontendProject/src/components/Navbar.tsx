import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Gamepad2, LogOut, Menu, ShieldCheck, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { useTranslation } from "@/i18n/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links: NavItem[] = isAdmin
    ? [
        { to: "/admin", label: t("nav.overview"), end: true },
        { to: "/admin/payments", label: t("nav.payments") },
        { to: "/admin/orders", label: t("nav.orders") },
        { to: "/admin/disputes", label: t("nav.disputes") },
        { to: "/admin/payment-accounts", label: t("nav.paymentAccounts") },
      ]
    : isAuthenticated
    ? [
        { to: "/products", label: t("nav.browse") },
        { to: "/dashboard", label: t("nav.dashboard"), end: true },
        { to: "/orders", label: t("nav.myOrders") },
        { to: "/seller", label: t("nav.sell") },
        { to: "/disputes", label: t("nav.disputes") },
      ]
    : [
        { to: "/", label: t("nav.home"), end: true },
        { to: "/products", label: t("nav.browse") },
      ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to={isAdmin ? "/admin" : "/"} className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground shadow-glow-sm transition-shadow group-hover:shadow-glow">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            GameAcc<span className="text-gradient">Shop</span>
          </span>
          {isAdmin && (
            <span className="ml-1 hidden items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-primary sm:inline-flex">
              <ShieldCheck className="h-3 w-3" /> {t("badge.admin")}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar>
                    <AvatarFallback>{initials(user?.login)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                    {user?.login}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user?.login}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">{t("user.dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">{t("user.myOrders")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/seller">{t("user.sellerArea")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> {t("user.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t("auth.signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">{t("auth.getStarted")}</Link>
              </Button>
            </div>
          )}

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("menu.toggle")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container flex flex-col py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-primary" : "text-foreground hover:bg-secondary"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 flex gap-2 border-t border-border pt-3 sm:hidden">
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link to="/login">{t("auth.signIn")}</Link>
                </Button>
                <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                  <Link to="/register">{t("auth.getStarted")}</Link>
                </Button>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3 sm:hidden">
              <span className="text-sm font-medium text-muted-foreground">{t("lang.label")}</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
