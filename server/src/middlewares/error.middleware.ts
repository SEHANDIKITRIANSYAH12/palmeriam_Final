import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new HttpError(404, `Not Found - ${req.originalUrl}`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
  });
}
