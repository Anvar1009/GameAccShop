import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CreditCard, Pencil, Trash2, Wallet } from "lucide-react";
import { isAxiosError } from "axios";
import {
  useActivePaymentAccount,
  useCreatePaymentAccount,
  useDeletePaymentAccount,
  useUpdatePaymentAccount,
} from "./admin-hooks";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageLoader } from "@/components/states";
import { useTranslation } from "@/i18n/useTranslation";
import { PaymentMethod, paymentMethodKey } from "@/lib/enums";

const METHODS = [
  PaymentMethod.CardTransfer,
  PaymentMethod.Click,
  PaymentMethod.Payme,
  PaymentMethod.UzumBank,
  PaymentMethod.Stripe,
];

const schema = z.object({
  name: z.string().min(1, "validation.providerRequired"),
  ownerName: z.string().min(1, "validation.ownerRequired"),
  accountNumber: z.string().min(1, "validation.accountNumberRequired"),
  method: z.coerce.number(),
});

type FormValues = z.infer<typeof schema>;

export function PaymentAccountsPage() {
  const { t } = useTranslation();
  const { data: account, isLoading, isError, error } = useActivePaymentAccount();
  const createAccount = useCreatePaymentAccount();
  const updateAccount = useUpdatePaymentAccount();
  const deleteAccount = useDeletePaymentAccount();
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const notFound = isError && isAxiosError(error) && error.response?.status === 404;
  const hasAccount = !!account && !notFound;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", ownerName: "", accountNumber: "", method: PaymentMethod.CardTransfer },
  });

  const method = watch("method");

  useEffect(() => {
    if (hasAccount && editing && account) {
      reset({
        name: account.name,
        ownerName: account.ownerName,
        accountNumber: account.accountNumber,
        method: account.method,
      });
    }
  }, [hasAccount, editing, account, reset]);

  const onSubmit = async (values: FormValues) => {
    if (hasAccount && account) {
      await updateAccount.mutateAsync({ id: account.id, payload: values });
    } else {
      await createAccount.mutateAsync(values);
    }
    setEditing(false);
    reset();
  };

  const handleDelete = async () => {
    if (!account) return;
    await deleteAccount.mutateAsync(account.id);
    setDeleteOpen(false);
  };

  if (isLoading) return <PageLoader label={t("paymentAccounts.loading")} />;

  const showForm = editing || !hasAccount;

  return (
    <div className="page-container max-w-3xl">
      <PageHeader
        title={t("paymentAccounts.title")}
        description={t("paymentAccounts.desc")}
      />

      {isError && !notFound && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {t("paymentAccounts.loadError")}
        </div>
      )}

      {!hasAccount && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {t("paymentAccounts.noneWarning")}
          </span>
        </div>
      )}

      {hasAccount && !editing && account && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> {t("paymentAccounts.activeAccount")}
            </CardTitle>
            <Badge tone={account.isActive ? "success" : "neutral"}>
              {account.isActive ? t("paymentAccounts.active") : t("paymentAccounts.inactive")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-500 p-5 text-primary-foreground shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-primary-foreground/70">{account.name}</p>
                <CreditCard className="h-5 w-5 opacity-80" />
              </div>
              <p className="mt-3 font-mono text-xl tracking-wider">{account.accountNumber}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>{account.ownerName}</span>
                <span className="opacity-80">{t(paymentMethodKey(account.method))}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" /> {t("common.edit")}
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/5"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" /> {t("common.delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{hasAccount ? t("paymentAccounts.editTitle") : t("paymentAccounts.addTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField label={t("paymentAccounts.providerName")} htmlFor="name" error={errors.name?.message && t(errors.name.message as never)} required>
                <Input id="name" placeholder={t("paymentAccounts.providerPlaceholder")} {...register("name")} />
              </FormField>
              <FormField label={t("paymentAccounts.ownerName")} htmlFor="ownerName" error={errors.ownerName?.message && t(errors.ownerName.message as never)} required>
                <Input id="ownerName" placeholder={t("paymentAccounts.ownerPlaceholder")} {...register("ownerName")} />
              </FormField>
              <FormField label={t("paymentAccounts.accountNumber")} htmlFor="accountNumber" error={errors.accountNumber?.message && t(errors.accountNumber.message as never)} required>
                <Input id="accountNumber" placeholder="8600 1234 5678 9012" {...register("accountNumber")} />
              </FormField>
              <FormField label={t("paymentAccounts.method")} error={errors.method?.message && t(errors.method.message as never)} required>
                <Select
                  value={String(method)}
                  onValueChange={(v) => setValue("method", Number(v), { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {t(paymentMethodKey(m))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div className="flex gap-2 pt-2">
                <Button type="submit" loading={createAccount.isPending || updateAccount.isPending}>
                  {hasAccount ? t("common.saveChanges") : t("paymentAccounts.addAccount")}
                </Button>
                {hasAccount && (
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                    {t("common.cancel")}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("paymentAccounts.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("paymentAccounts.deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="destructive" onClick={handleDelete} loading={deleteAccount.isPending}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
