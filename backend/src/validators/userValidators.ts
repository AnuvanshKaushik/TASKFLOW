import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80)
});

export const updateRoleSchema = z.object({
  role: z.enum(["Admin", "Member"])
});

