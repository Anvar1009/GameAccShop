import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { useSellerProductDetails, useUpdateProduct } from "./seller-hooks";
import { useAuth } from "@/features/auth/useAuth";
import { useTranslation } from "@/i18n/useTranslation";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState, PageLoader } from "@/components/states";
import type { ProductFormValues } from "./seller-api";

export function ProductEditPage() {
  const { productId: rawId } = useParams();
  const productId = Number(rawId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: product, isLoading, isError, refetch } = useSellerProductDetails(productId);
  const updateProduct = useUpdateProduct();

  if (isLoading) return <PageLoader label={t("productEdit.loading")} />;
  if (isError || !product)
    return (
      <div className="page-container">
        <ErrorState message={t("productEdit.loadError")} onRetry={() => refetch()} />
      </div>
    );

  const handleSubmit = async (values: ProductFormValues) => {
    await updateProduct.mutateAsync({ id: productId, sellerId: user!.userId, values });
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
      <PageHeader
        title={t("productEdit.title")}
        description={t("productEdit.desc")}
      />
      <ProductForm
        mode="edit"
        submitting={updateProduct.isPending}
        onSubmit={handleSubmit}
        initial={{
          description: product.description,
          accPrice: product.accPrice,
          accStrength: product.accStrength,
          coinsCount: product.coinsCount,
          playerCount: product.playerCount,
          tags: Array.from(new Set(product.tags ?? [])),
        }}
      />
    </div>
  );
}
