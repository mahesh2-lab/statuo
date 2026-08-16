import { NextFunction, Request, Response } from "express";
import { auth } from "../libs/auth";
import { fromNodeHeaders } from "better-auth/node";
import { ApiError } from "../utils/api-response";

export type AuthSession = typeof auth.$Infer.Session;

declare global {
  namespace Express {
    interface Request {
      session?: AuthSession["session"];
      user?: AuthSession["user"];
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw ApiError.unauthorized("Authentication required to access this resource");
    }

    req.session = session.session;
    req.user = session.user;
    next();
  } catch (error) {
    next(error);
  }
};
