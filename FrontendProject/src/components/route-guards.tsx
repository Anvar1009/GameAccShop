import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

/** Requires an authenticated user; otherwise redirect to login (remembering where). */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

/** Requires Admin (or Super_Aamin). */
export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/** Non-admin selling/buying area — admins are redirected to their console. */
export function UserRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}

/** Login/Register pages: redirect away if already authenticated. */
export function GuestRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  return <Outlet />;
}
