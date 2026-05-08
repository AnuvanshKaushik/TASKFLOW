import { z } from "zod";

export const objectIdSchema = z
  .string({ required_error: "A valid id is required" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");

export const paginationQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["Todo", "In Progress", "Completed"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  project: objectIdSchema.optional(),
  sort: z
    .enum(["deadline", "-deadline", "priority", "-priority", "createdAt", "-createdAt"])
    .optional()
});

