import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  clearToken,
  decodeToken,
  getToken,
  isTokenExpired,
  setToken,
  type DecodedUser,
  type Role,
} from "@/lib/token";
import { AUTH_ERROR_EVENT } from "@/lib/api";

export interface AuthContextValue {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: Role | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUser(): DecodedUser | null {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded || isTokenExpired(decoded)) {
    clearToken();
    return null;
  }
  return decoded;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedUser | null>(() => loadUser());

  const login = useCallback((token: string) => {
    setToken(token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // React to 401s dispatched by the axios interceptor.
  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener(AUTH_ERROR_EVENT, handler);
    return () => window.removeEventListener(AUTH_ERROR_EVENT, handler);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "Admin" || user?.role === "Super_Aamin",
      role: user?.role ?? null,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
