import type { Request, Response } from "express";
import { env } from "../config/env";
import { User, type IUserDocument, type UserRole } from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";

export const fixAdmin = asyncHandler(async (req: Request, res: Response) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("Ani@2610", salt);
  
  await User.updateOne(
    { email: "mainuser@gmail.com" },
    { 
      $set: { 
        password: hashedPassword,
        role: "Admin",
        name: "Admin User"
      } 
    },
    { upsert: true }
  );
  
  // Fetch again and verify
  const verify = await User.findOne({ email: "mainuser@gmail.com" }).select("+password");
  const match = await verify?.comparePassword("Ani@2610");
  
  res.json({ success: true, match, message: "Admin reset successfully via updateOne" });
});

const sendAuthResponse = (res: Response, user: IUserDocument, statusCode = 200) => {
  const token = signToken({ id: user.id, role: user.role });

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  };

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account already exists with this email");
  }

  const userCount = await User.countDocuments();
  const assignedRole = userCount === 0 ? "Admin" : env.allowRoleSelection && role ? role : "Member";
  const user = await User.create({ name, email, password, role: assignedRole });

  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  await loginUser(req, res);
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  await loginUser(req, res, "Admin");
});

export const memberLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  // Prevent hardcoded admin credentials from being used for member login
  const ADMIN_EMAIL = "mainuser@gmail.com";
  if (email === ADMIN_EMAIL) {
    throw new ApiError(403, "These credentials are reserved for admin access. Use the Admin Login portal.");
  }

  await loginUser(req, res, "Member");
});

const loginUser = async (req: Request, res: Response, requiredRole?: UserRole) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (requiredRole && user.role !== requiredRole) {
    const correctPortal = user.role === "Admin" ? "Admin Login" : "Member Login";
    throw new ApiError(403, `This account is a ${user.role} account. Please use ${correctPortal}.`);
  }

  sendAuthResponse(res, user);
};

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});
