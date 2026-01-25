export type AuthUser = {
  id: number;
  username: string;
  name: string;
  role: string;
};

export type AuthState = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = "siipalmi_admin_auth";

export function getAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function setAuth(auth: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getToken(): string | null {
  return getAuth()?.token ?? null;
}
