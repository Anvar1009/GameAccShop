import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Info, Tag, X } from "lucide-react";
import type { ProductFormValues } from "./seller-api";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  description: z.string().min(1, "validation.descRequired"),
  accPrice: z.coerce.number().positive("validation.pricePositive"),
  accStrength: z.coerce.number().int().min(0, "validation.nonNegative"),
  coinsCount: z.coerce.number().int().min(0, "validation.nonNegative"),
  playerCount: z.coerce.number().int().min(0, "validation.nonNegative"),
  accEmail: z.string().min(1, "validation.accEmailRequired"),
  accPassword: z.string().min(1, "validation.accPasswordRequired"),
});

type FieldValues = z.infer<typeof schema>;

const IMAGE_ACCEPT = "image/*,video/*";

export interface ProductFormProps {
  mode: "create" | "edit";
  initial?: Partial<ProductFormValues>;
  submitting?: boolean;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
}

export function ProductForm({ mode, initial, submitting, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: initial?.description ?? "",
      accPrice: initial?.accPrice ?? undefined,
      accStrength: initial?.accStrength ?? undefined,
      coinsCount: initial?.coinsCount ?? undefined,
      playerCount: initial?.playerCount ?? undefined,
      accEmail: initial?.accEmail ?? "",
      accPassword: initial?.accPassword ?? "",
    },
  });

  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    if (tags.length === 0) {
      setFormError(t("productForm.errNoTag"));
      return;
    }
    if (files.length === 0) {
      setFormError(
        mode === "create"
          ? t("productForm.errNoMediaCreate")
          : t("productForm.errNoMediaEdit")
      );
      return;
    }
    await onSubmit({ ...values, tags, medias: files });
  });

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("productForm.accountDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label={t("productForm.description")} htmlFor="description" error={errors.description?.message && t(errors.description.message as never)} required>
              <Textarea
                id="description"
                placeholder={t("productForm.descPlaceholder")}
                {...register("description")}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("productForm.priceUsd")} htmlFor="accPrice" error={errors.accPrice?.message && t(errors.accPrice.message as never)} required>
                <Input id="accPrice" type="number" step="1000" min="0" placeholder="1500000" {...register("accPrice")} />
              </FormField>
              <FormField label={t("productForm.accStrength")} htmlFor="accStrength" error={errors.accStrength?.message && t(errors.accStrength.message as never)} required>
                <Input id="accStrength" type="number" min="0" placeholder="3190" {...register("accStrength")} />
              </FormField>
              <FormField label={t("productForm.coins")} htmlFor="coinsCount" error={errors.coinsCount?.message && t(errors.coinsCount.message as never)} required>
                <Input id="coinsCount" type="number" min="0" placeholder="3500" {...register("coinsCount")} />
              </FormField>
              <FormField label={t("productForm.playerCount")} htmlFor="playerCount" error={errors.playerCount?.message && t(errors.playerCount.message as never)} required>
                <Input id="playerCount" type="number" min="0" placeholder="42" {...register("playerCount")} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("productForm.media")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mode === "edit" && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-amber-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                {t("productForm.editMediaWarning")}
              </div>
            )}
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-4 py-8 text-center hover:border-primary hover:bg-accent/40"
            >
              <ImagePlus className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium">{t("productForm.dropMedia")}</p>
              <p className="text-xs text-muted-foreground">{t("productForm.mediaTypes")}</p>
              <input
                ref={fileRef}
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {files.map((f, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
                    {f.type.startsWith("video") ? (
                      <video src={URL.createObjectURL(f)} className="h-full w-full object-cover" />
                    ) : (
                      <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("productForm.tags")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder={t("productForm.addTag")}
                  className="pl-9"
                />
              </div>
              <Button type="button" variant="outline" onClick={addTag}>
                {t("common.add")}
              </Button>
            </div>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} tone="info" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== tag))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{t("productForm.tagsHint")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("productForm.credentials")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {t("productForm.credentialsNote")}
            </p>
            <FormField label={t("productForm.accEmail")} htmlFor="accEmail" error={errors.accEmail?.message && t(errors.accEmail.message as never)} required>
              <Input id="accEmail" autoComplete="off" placeholder="account@email.com" {...register("accEmail")} />
            </FormField>
            <FormField label={t("productForm.accPassword")} htmlFor="accPassword" error={errors.accPassword?.message && t(errors.accPassword.message as never)} required>
              <Input id="accPassword" type="password" autoComplete="off" placeholder="••••••••" {...register("accPassword")} />
            </FormField>
          </CardContent>
        </Card>

        {formError && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          {mode === "create" ? t("productForm.publish") : t("common.saveChanges")}
        </Button>
      </div>
    </form>
  );
}
