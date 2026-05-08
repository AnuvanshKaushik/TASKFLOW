import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode ?? 500;
  let message = error.message ?? "Something went wrong";
  let details = error.details;

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = "Validation failed";
    details = Object.values(error.errors).map((item) => item.message);
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: env.nodeEnv === "production" ? undefined : error.stack
  });
};
