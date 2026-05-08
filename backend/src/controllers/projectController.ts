import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Activity } from "../models/Activity";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const projectPopulate = [
  { path: "members", select: "name email role" },
  { path: "createdBy", select: "name email role" },
  {
    path: "tasks",
    select: "title status priority deadline assignedTo",
    populate: { path: "assignedTo", select: "name email role" }
  }
];

const uniqueIds = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));

const ensureUsersExist = async (ids: string[]) => {
  if (ids.length === 0) return;

  const count = await User.countDocuments({ _id: { $in: ids } });
  if (count !== ids.length) {
    throw new ApiError(400, "One or more selected team members do not exist");
  }
};

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const memberIds = uniqueIds([req.user!.id, ...(req.body.members ?? [])]);
  await ensureUsersExist(memberIds);

  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    deadline: new Date(req.body.deadline),
    members: memberIds,
    createdBy: req.user!._id
  });

  await User.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { assignedProjects: project._id } }
  );

  await Activity.create({
    type: "PROJECT_CREATED",
    message: `${req.user!.name} created ${project.title}`,
    actor: req.user!._id,
    project: project._id
  });

  const populatedProject = await Project.findById(project._id).populate(projectPopulate);

  res.status(201).json({
    success: true,
    project: populatedProject
  });
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as { search?: string };
  const filter: Record<string, unknown> = req.user!.role === "Admin" ? {} : { members: req.user!._id };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const projects = await Project.find(filter).populate(projectPopulate).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    projects
  });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id).populate(projectPopulate);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const hasAccess =
    req.user!.role === "Admin" ||
    project.members.some((member) => member._id.toString() === req.user!.id);

  if (!hasAccess) {
    throw new ApiError(403, "You do not have access to this project");
  }

  res.status(200).json({
    success: true,
    project
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const oldMemberIds = project.members.map((member) => member.toString());

  if (req.body.title !== undefined) project.title = req.body.title;
  if (req.body.description !== undefined) project.description = req.body.description;
  if (req.body.deadline !== undefined) project.deadline = new Date(req.body.deadline);

  if (req.body.members !== undefined) {
    const memberIds = uniqueIds([project.createdBy.toString(), ...(req.body.members ?? [])]);
    await ensureUsersExist(memberIds);
    project.members = memberIds.map((id) => new Types.ObjectId(id));

    const removedMemberIds = oldMemberIds.filter((id) => !memberIds.includes(id));
    const addedMemberIds = memberIds.filter((id) => !oldMemberIds.includes(id));

    await Promise.all([
      User.updateMany(
        { _id: { $in: addedMemberIds } },
        { $addToSet: { assignedProjects: project._id } }
      ),
      User.updateMany(
        { _id: { $in: removedMemberIds } },
        { $pull: { assignedProjects: project._id } }
      )
    ]);
  }

  await project.save();

  await Activity.create({
    type: "PROJECT_UPDATED",
    message: `${req.user!.name} updated ${project.title}`,
    actor: req.user!._id,
    project: project._id
  });

  const populatedProject = await Project.findById(project._id).populate(projectPopulate);

  res.status(200).json({
    success: true,
    project: populatedProject
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await Promise.all([
    Task.deleteMany({ project: project._id }),
    User.updateMany({ assignedProjects: project._id }, { $pull: { assignedProjects: project._id } })
  ]);

  await Activity.create({
    type: "PROJECT_DELETED",
    message: `${req.user!.name} deleted ${project.title}`,
    actor: req.user!._id
  });

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully"
  });
});

export const addProjectMember = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await User.findById(req.body.memberId);
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }

  await Promise.all([
    Project.findByIdAndUpdate(project._id, { $addToSet: { members: member._id } }, { new: true }),
    User.findByIdAndUpdate(member._id, { $addToSet: { assignedProjects: project._id } }),
    Activity.create({
      type: "MEMBER_ADDED",
      message: `${req.user!.name} added ${member.name} to ${project.title}`,
      actor: req.user!._id,
      project: project._id
    })
  ]);

  const populatedProject = await Project.findById(project._id).populate(projectPopulate);

  res.status(200).json({
    success: true,
    project: populatedProject
  });
});

export const removeProjectMember = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.createdBy.toString() === req.body.memberId) {
    throw new ApiError(400, "Project creator cannot be removed");
  }

  const member = await User.findById(req.body.memberId);
  if (!member) {
    throw new ApiError(404, "Team member not found");
  }

  await Promise.all([
    Project.findByIdAndUpdate(project._id, { $pull: { members: member._id } }, { new: true }),
    User.findByIdAndUpdate(member._id, { $pull: { assignedProjects: project._id } }),
    Activity.create({
      type: "MEMBER_REMOVED",
      message: `${req.user!.name} removed ${member.name} from ${project.title}`,
      actor: req.user!._id,
      project: project._id
    })
  ]);

  const populatedProject = await Project.findById(project._id).populate(projectPopulate);

  res.status(200).json({
    success: true,
    project: populatedProject
  });
});

