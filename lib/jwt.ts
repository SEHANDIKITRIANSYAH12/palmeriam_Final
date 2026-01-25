import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  userId: number;
  username: string;
  role: string;
};

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  const expiresInEnv = process.env.JWT_EXPIRES_IN || "7d";
  const options: SignOptions = { expiresIn: expiresInEnv as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret as Secret, options);
}

export function verifyJwt(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.verify(token, secret as Secret) as JwtPayload;
}
