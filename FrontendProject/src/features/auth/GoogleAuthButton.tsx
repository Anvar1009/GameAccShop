import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "./auth-api";
import { useAuth } from "./useAuth";
import { decodeToken } from "@/lib/token";
import { getErrorMessage } from "@/lib/api";
import { useTranslation } from "@/i18n/useTranslation";

/** "Continue with Google" — signs an existing user in or registers a new one automatically. */
export function GoogleAuthButton() {
  const { login: signIn } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error(t("auth.googleError"));
      return;
    }
    try {
      const res = await authApi.googleAuth({ idToken: credentialResponse.credential });
      signIn(res.token);
      const decoded = decodeToken(res.token);
      const isAdmin = decoded?.role === "Admin" || decoded?.role === "Super_Aamin";
      navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e, t("auth.googleError")));
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin onSuccess={onSuccess} onError={() => toast.error(t("auth.googleError"))} text="continue_with" />
    </div>
  );
}
