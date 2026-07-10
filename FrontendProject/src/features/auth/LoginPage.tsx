import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gamepad2, Lock } from "lucide-react";
import { authApi } from "./auth-api";
import { useAuth } from "./useAuth";
import { decodeToken } from "@/lib/token";
import { getErrorMessage } from "@/lib/api";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/FormField";
import { AuthAside } from "./AuthAside";

const schema = z.object({
  login: z.string().min(1, "validation.loginRequired"),
  password: z.string().min(1, "validation.passwordRequired"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await authApi.login(values);
      login(res.token);
      const decoded = decodeToken(res.token);
      const isAdmin = decoded?.role === "Admin" || decoded?.role === "Super_Aamin";
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || (isAdmin ? "/admin" : "/dashboard"), { replace: true });
    } catch (e) {
      setServerError(getErrorMessage(e, t("login.invalid")));
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">GameAccShop</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
              <CardDescription>{t("login.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {serverError && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}
                <FormField label={t("login.login")} htmlFor="login" error={errors.login?.message && t(errors.login.message as never)} required>
                  <Input id="login" placeholder="your_login" autoComplete="username" {...register("login")} />
                </FormField>
                <FormField label={t("login.password")} htmlFor="password" error={errors.password?.message && t(errors.password.message as never)} required>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                </FormField>
                <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                  {t("login.submit")}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {t("login.noAccount")}{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  {t("login.createOne")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
