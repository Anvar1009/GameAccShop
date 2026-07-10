import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "./auth-api";
import { useAuth } from "./useAuth";
import { getErrorMessage } from "@/lib/api";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/FormField";
import { AuthAside } from "./AuthAside";

const schema = z.object({
  firstName: z.string().min(1, "validation.firstNameRequired"),
  lastName: z.string().min(1, "validation.lastNameRequired"),
  login: z.string().min(3, "validation.loginMin"),
  phoneNumber: z.string().min(5, "validation.phoneInvalid"),
  password: z.string().min(6, "validation.passwordMin6"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { login: signIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await authApi.register(values);
      // Auto-login for a smooth onboarding experience.
      const res = await authApi.login({ login: values.login, password: values.password });
      signIn(res.token);
      toast.success(t("register.success"));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setServerError(getErrorMessage(e, t("register.error")));
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
              <CardTitle className="text-2xl">{t("register.title")}</CardTitle>
              <CardDescription>{t("register.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {serverError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {serverError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <FormField label={t("register.firstName")} htmlFor="firstName" error={errors.firstName?.message && t(errors.firstName.message as never)} required>
                    <Input id="firstName" placeholder="Jane" {...register("firstName")} />
                  </FormField>
                  <FormField label={t("register.lastName")} htmlFor="lastName" error={errors.lastName?.message && t(errors.lastName.message as never)} required>
                    <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                  </FormField>
                </div>
                <FormField label={t("register.login")} htmlFor="login" error={errors.login?.message && t(errors.login.message as never)} required>
                  <Input id="login" placeholder="jane_doe" autoComplete="username" {...register("login")} />
                </FormField>
                <FormField label={t("register.phone")} htmlFor="phoneNumber" error={errors.phoneNumber?.message && t(errors.phoneNumber.message as never)} required>
                  <Input id="phoneNumber" placeholder="+998 90 123 45 67" {...register("phoneNumber")} />
                </FormField>
                <FormField label={t("register.password")} htmlFor="password" error={errors.password?.message && t(errors.password.message as never)} required>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password")}
                  />
                </FormField>
                <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                  {t("register.submit")}
                </Button>
              </form>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {t("register.benefit")}
              </p>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {t("register.already")}{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  {t("register.signIn")}
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
