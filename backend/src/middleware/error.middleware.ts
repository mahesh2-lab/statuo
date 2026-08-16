import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-response";

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: "NotFound",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Global Error Handler
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || undefined;

  console.error(`[Error] ${req.method} ${req.originalUrl} (${statusCode}):`, err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.name || "ServerError",
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};
