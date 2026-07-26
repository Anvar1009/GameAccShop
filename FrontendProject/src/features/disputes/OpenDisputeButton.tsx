import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/i18n/useTranslation";
import { useOpenDispute } from "./disputes-hooks";

const schema = z.object({
  reason: z.string().min(10, "validation.disputeReasonMin"),
});

type FormValues = z.infer<typeof schema>;

export function OpenDisputeButton({ orderId }: { orderId: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const openDispute = useOpenDispute();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const dispute = await openDispute.mutateAsync({ orderId, reason: values.reason });
    setOpen(false);
    reset();
    navigate(`/disputes/${dispute.id}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full text-destructive hover:bg-destructive/5"
        onClick={() => setOpen(true)}
      >
        <ShieldAlert className="h-4 w-4" /> {t("orderDetails.openDispute")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogHeader>
              <DialogTitle>{t("disputeDialog.title")}</DialogTitle>
              <DialogDescription>{t("disputeDialog.desc")}</DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <FormField
                label={t("disputeDialog.reasonLabel")}
                htmlFor="reason"
                error={errors.reason?.message && t(errors.reason.message as never)}
                required
              >
                <Textarea
                  id="reason"
                  placeholder={t("disputeDialog.reasonPlaceholder")}
                  {...register("reason")}
                />
              </FormField>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" variant="destructive" loading={openDispute.isPending}>
                {t("disputeDialog.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
