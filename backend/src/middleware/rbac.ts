import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../models/User";
import { ApiError } from "../utils/apiError";

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to perform this action"));
      return;
    }

    next();
  };

