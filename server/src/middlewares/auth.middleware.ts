import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./error.middleware";
import { verifyJwt } from "../utils/jwt";

type AuthedRequest = Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing Authorization header"));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyJwt(token);
    req.user = { id: payload.userId, username: payload.username, role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token"));
  }
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Unauthorized"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Forbidden"));
  return next();
}
