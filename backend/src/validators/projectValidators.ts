import { z } from "zod";
import { objectIdSchema } from "./common";

const futureDate = z
  .string()
  .datetime({ message: "Deadline must be a valid ISO date" })
  .refine((value) => new Date(value).getTime() > Date.now(), "Deadline must be in the future");

export const createProjectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().trim().min(8, "Description must be at least 8 characters").max(1200),
  members: z.array(objectIdSchema).default([]),
  deadline: futureDate
});

export const updateProjectSchema = createProjectSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required"
);

export const memberMutationSchema = z.object({
  memberId: objectIdSchema
});

