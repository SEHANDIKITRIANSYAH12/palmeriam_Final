import { getToken } from "@/lib/auth";

const BASE_URL = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiErrorPayload = {
  message?: string;
};

async function parseError(res: Response) {
  try {
    const data = (await res.json()) as ApiErrorPayload;
    return data?.message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  return apiFetch<T>(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    role: string;
  };
};

export async function loginApi(username: string, password: string) {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
