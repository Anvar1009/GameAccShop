import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { useCreateProduct } from "./seller-hooks";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import type { ProductFormValues } from "./seller-api";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createProduct = useCreateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    await createProduct.mutateAsync(values);
    navigate("/seller/products");
  };

  return (
    <div className="page-container">
      <Link
        to="/seller/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back.myProducts")}
      </Link>
      <PageHeader title={t("productCreate.title")} description={t("productCreate.desc")} />
      <ProductForm mode="create" submitting={createProduct.isPending} onSubmit={handleSubmit} />
    </div>
  );
}
