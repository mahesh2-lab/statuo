import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Standardized API Success Response Class
 */
export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data?: T;
  public readonly timestamp: string;

  constructor(statusCode: number, data?: T, message: string = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Helper to send JSON response directly via Express Response
   */
  public send(res: Response): Response {
    return res.status(this.statusCode).json(this);
  }

  /**
   * 200 OK Response
   */
  public static ok<T>(res: Response, data?: T, message: string = "Success"): Response {
    return new ApiResponse(200, data, message).send(res);
  }

  /**
   * 201 Created Response
   */
  public static created<T>(res: Response, data?: T, message: string = "Resource created successfully"): Response {
    return new ApiResponse(201, data, message).send(res);
  }
}

/**
 * Standardized API Error Class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors?: any;
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors?: any,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static badRequest(message: string = "Bad Request", errors?: any): ApiError {
    return new ApiError(400, message, errors);
  }

  public static unauthorized(message: string = "Unauthorized access"): ApiError {
    return new ApiError(401, message);
  }

  public static forbidden(message: string = "Forbidden resource"): ApiError {
    return new ApiError(403, message);
  }

  public static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  public static conflict(message: string = "Resource conflict"): ApiError {
    return new ApiError(409, message);
  }

  public static internal(message: string = "Internal Server Error", errors?: any): ApiError {
    return new ApiError(500, message, errors);
  }
}

/**
 * Async Controller Wrapper to catch errors automatically
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
