import { Router } from "express";
import { z } from "zod";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeProjectMember,
  updateProject
} from "../controllers/projectController";
import { protect } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { objectIdSchema } from "../validators/common";
import {
  createProjectSchema,
  memberMutationSchema,
  updateProjectSchema
} from "../validators/projectValidators";

const router = Router();
const idParamsSchema = z.object({ id: objectIdSchema });

router.use(protect);
router.get("/", getProjects);
router.get("/:id", validate(idParamsSchema, "params"), getProjectById);
router.post("/", requireRole("Admin"), validate(createProjectSchema), createProject);
router.patch(
  "/:id",
  requireRole("Admin"),
  validate(idParamsSchema, "params"),
  validate(updateProjectSchema),
  updateProject
);
router.delete("/:id", requireRole("Admin"), validate(idParamsSchema, "params"), deleteProject);
router.post(
  "/:id/members",
  requireRole("Admin"),
  validate(idParamsSchema, "params"),
  validate(memberMutationSchema),
  addProjectMember
);
router.delete(
  "/:id/members",
  requireRole("Admin"),
  validate(idParamsSchema, "params"),
  validate(memberMutationSchema),
  removeProjectMember
);

export default router;

