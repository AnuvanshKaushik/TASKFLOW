import { Router } from "express";
import { getUsers, updateProfile, updateRole } from "../controllers/userController";
import { protect } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { objectIdSchema } from "../validators/common";
import { updateProfileSchema, updateRoleSchema } from "../validators/userValidators";
import { z } from "zod";

const router = Router();
const idParamsSchema = z.object({ id: objectIdSchema });

router.use(protect);
router.get("/", getUsers);
router.patch("/me", validate(updateProfileSchema), updateProfile);
router.patch(
  "/:id/role",
  requireRole("Admin"),
  validate(idParamsSchema, "params"),
  validate(updateRoleSchema),
  updateRole
);

export default router;

