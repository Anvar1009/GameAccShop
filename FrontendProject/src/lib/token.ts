const TOKEN_KEY = "gameaccshop.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export type Role = "Admin" | "Super_Aamin" | "User";

export interface DecodedUser {
  userId: number;
  login: string;
  role: Role;
  exp?: number;
}

/**
 * The backend's /api/Auth/me only returns the login string, so we decode the
 * JWT to recover userId and role. Claims are emitted with the long
 * ClaimTypes URIs by ASP.NET Core (nameidentifier, name, role).
 */
export function decodeToken(token: string): DecodedUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    const idClaim =
      json["nameid"] ??
      json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
      json["sub"];
    const nameClaim =
      json["unique_name"] ??
      json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
      json["name"];
    const roleClaim =
      json["role"] ??
      json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (idClaim == null) return null;

    return {
      userId: Number(idClaim),
      login: String(nameClaim ?? ""),
      role: (roleClaim as Role) ?? "User",
      exp: json["exp"],
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(user: DecodedUser | null): boolean {
  if (!user?.exp) return false;
  return Date.now() >= user.exp * 1000;
}
