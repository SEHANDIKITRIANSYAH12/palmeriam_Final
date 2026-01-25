import { NextRequest } from "next/server";
import { verifyJwt } from "./jwt";
import { HttpError } from "./errors";

export type AuthUser = {
  id: number;
  username: string;
  role: string;
};

export function getAuthUser(req: NextRequest): AuthUser {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing Authorization header");
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyJwt(token);
    return { id: payload.userId, username: payload.username, role: payload.role };
  } catch {
    throw new HttpError(401, "Invalid token");
  }
}

export function requireAuth(req: NextRequest): AuthUser {
  return getAuthUser(req);
}

export function requireAdmin(req: NextRequest): AuthUser {
  const user = getAuthUser(req);
  if (user.role !== "admin") {
    throw new HttpError(403, "Forbidden");
  }
  return user;
}
