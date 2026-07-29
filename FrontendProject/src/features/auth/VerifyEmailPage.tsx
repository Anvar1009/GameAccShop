import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gamepad2, MailCheck } from "lucide-react";
import { toast } from "sonner";
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

const RESEND_COOLDOWN_SECONDS = 60;

const schema = z.object({
  code: z.string().min(6, "validation.codeInvalid").max(6, "validation.codeInvalid"),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailPage() {
  const { login: signIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const email = (location.state as { login?: string } | null)?.login ?? "";

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await authApi.verifyEmail({ login: email, code: values.code });
      signIn(res.token);
      const decoded = decodeToken(res.token);
      const isAdmin = decoded?.role === "Admin" || decoded?.role === "Super_Aamin";
      toast.success(t("verifyEmail.success"));
      navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
    } catch (e) {
      setServerError(getErrorMessage(e, t("verifyEmail.error")));
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setServerError(null);
    try {
      await authApi.resendCode({ login: email });
      toast.success(t("verifyEmail.resent"));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e) {
      setServerError(getErrorMessage(e, t("verifyEmail.error")));
    } finally {
      setResending(false);
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
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">{t("verifyEmail.title")}</CardTitle>
              <CardDescription>
                {t("verifyEmail.subtitle")} <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {serverError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </div>
                )}
                <FormField
                  label={t("verifyEmail.code")}
                  htmlFor="code"
                  error={errors.code?.message && t(errors.code.message as never)}
                  required
                >
                  <Input
                    id="code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    className="text-center text-lg tracking-[0.5em]"
                    {...register("code")}
                  />
                </FormField>
                <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                  {t("verifyEmail.submit")}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t("verifyEmail.noCode")}{" "}
                <button
                  type="button"
                  onClick={onResend}
                  disabled={cooldown > 0 || resending}
                  className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                >
                  {cooldown > 0
                    ? t("verifyEmail.resendIn").replace("{seconds}", String(cooldown))
                    : t("verifyEmail.resend")}
                </button>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  {t("verifyEmail.backToLogin")}
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
