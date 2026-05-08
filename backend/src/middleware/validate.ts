import type { NextFunction, Request, Response } from "express";
import type { z, ZodTypeAny } from "zod";
import { ApiError } from "../utils/apiError";

type RequestSource = "body" | "query" | "params";

export const validate =
  (schema: ZodTypeAny, source: RequestSource = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }));

      next(new ApiError(422, "Validation failed", details));
      return;
    }

    (req[source] as z.infer<typeof schema>) = result.data;
    next();
  };

