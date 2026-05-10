import { Router } from "express";
import { adminLogin, fixAdmin, getMe, login, logout, memberLogin, register } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/authValidators";

const router = Router();

router.post("/signup", validate(registerSchema), register);
router.get("/fix-admin", fixAdmin);
router.post("/login", validate(loginSchema), login);
router.post("/admin-login", validate(loginSchema), adminLogin);
router.post("/member-login", validate(loginSchema), memberLogin);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
