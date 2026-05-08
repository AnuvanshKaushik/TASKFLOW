import type { Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find()
    .select("name email role assignedProjects createdAt")
    .populate("assignedProjects", "title deadline")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user
  });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.id === req.user!.id) {
    throw new ApiError(400, "You cannot change your own role");
  }

  user.role = req.body.role;
  await user.save();

  res.status(200).json({
    success: true,
    user
  });
});

