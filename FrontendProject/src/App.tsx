import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AdminRoute, GuestRoute, ProtectedRoute, UserRoute } from "@/components/route-guards";

import { LandingPage } from "@/pages/LandingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { VerifyEmailPage } from "@/features/auth/VerifyEmailPage";

import { ProductCatalogPage } from "@/features/products/ProductCatalogPage";
import { ProductDetailsPage } from "@/features/products/ProductDetailsPage";

import { ChatPage } from "@/features/chat/ChatPage";

import { DisputesPage } from "@/features/disputes/DisputesPage";
import { DisputeDetailsPage } from "@/features/disputes/DisputeDetailsPage";
import { AdminDisputesPage } from "@/features/disputes/AdminDisputesPage";

import { BuyerDashboardPage } from "@/features/buyer/BuyerDashboardPage";
import { BuyerOrdersPage } from "@/features/buyer/BuyerOrdersPage";
import { BuyerOrderDetailsPage } from "@/features/buyer/BuyerOrderDetailsPage";
import { PaymentPage } from "@/features/buyer/PaymentPage";

import { SellerDashboardPage } from "@/features/seller/SellerDashboardPage";
import { SellerProductsPage } from "@/features/seller/SellerProductsPage";
import { ProductCreatePage } from "@/features/seller/ProductCreatePage";
import { ProductEditPage } from "@/features/seller/ProductEditPage";
import { SellerOrdersPage } from "@/features/seller/SellerOrdersPage";
import { SellerOrderDetailsPage } from "@/features/seller/SellerOrderDetailsPage";

import { AdminDashboardPage } from "@/features/admin/AdminDashboardPage";
import { AdminPaymentsPage } from "@/features/admin/AdminPaymentsPage";
import { AdminPaymentReviewPage } from "@/features/admin/AdminPaymentReviewPage";
import { AdminOrdersPage } from "@/features/admin/AdminOrdersPage";
import { PaymentAccountsPage } from "@/features/admin/PaymentAccountsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        {/* Guest-only */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Authenticated non-admin (buyer + seller share the User role) */}
        <Route element={<UserRoute />}>
          <Route path="/dashboard" element={<BuyerDashboardPage />} />
          <Route path="/orders" element={<BuyerOrdersPage />} />
          <Route path="/orders/:orderId" element={<BuyerOrderDetailsPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/chat/:orderId" element={<ChatPage />} />
          <Route path="/disputes" element={<DisputesPage />} />

          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<ProductCreatePage />} />
          <Route path="/seller/products/:productId/edit" element={<ProductEditPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/orders/:orderId" element={<SellerOrderDetailsPage />} />
        </Route>

        {/* Any authenticated user — dispute details are shared between the
            buyer/seller who filed them and the admin who resolves them. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/disputes/:id" element={<DisputeDetailsPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/payments/:id" element={<AdminPaymentReviewPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          <Route path="/admin/payment-accounts" element={<PaymentAccountsPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
