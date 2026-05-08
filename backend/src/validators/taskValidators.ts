import { z } from "zod";
import { objectIdSchema } from "./common";

const deadlineSchema = z
  .string()
  .datetime({ message: "Deadline must be a valid ISO date" })
  .refine((value) => new Date(value).getTime() > Date.now(), "Deadline must be in the future");

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(140),
  description: z.string().trim().min(8, "Description must be at least 8 characters").max(1000),
  status: z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  assignedTo: objectIdSchema,
  project: objectIdSchema,
  deadline: deadlineSchema
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const statusUpdateSchema = z.object({
  status: z.enum(["Todo", "In Progress", "Completed"])
});

