import { Router } from "express";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController";
import { protect } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { objectIdSchema, paginationQuerySchema } from "../validators/common";
import { createTaskSchema, statusUpdateSchema, updateTaskSchema } from "../validators/taskValidators";

const router = Router();
const idParamsSchema = z.object({ id: objectIdSchema });

router.use(protect);
router.get("/", validate(paginationQuerySchema, "query"), getTasks);
router.get("/:id", validate(idParamsSchema, "params"), getTaskById);
router.post("/", requireRole("Admin"), validate(createTaskSchema), createTask);
router.patch("/:id", validate(idParamsSchema, "params"), validate(updateTaskSchema), updateTask);
router.patch(
  "/:id/status",
  validate(idParamsSchema, "params"),
  validate(statusUpdateSchema),
  updateTask
);
router.delete("/:id", requireRole("Admin"), validate(idParamsSchema, "params"), deleteTask);

export default router;

