import type { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { Project } from "../models/Project";
import { Task, type TaskStatus } from "../models/Task";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const taskPopulate = [
  { path: "assignedTo", select: "name email role" },
  { path: "project", select: "title deadline members" }
];

const ensureAssignmentContext = async (projectId: string, assignedToId: string) => {
  const [project, assignee] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedToId)
  ]);

  if (!project) throw new ApiError(404, "Project not found");
  if (!assignee) throw new ApiError(404, "Assigned team member not found");

  const isProjectMember = project.members.some((member) => member.toString() === assignee.id);

  if (!isProjectMember) {
    project.members.push(assignee._id);
    await project.save();
  }

  await User.findByIdAndUpdate(assignee._id, { $addToSet: { assignedProjects: project._id } });

  return { project, assignee };
};

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { project, assignee } = await ensureAssignmentContext(req.body.project, req.body.assignedTo);

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    assignedTo: assignee._id,
    project: project._id,
    deadline: new Date(req.body.deadline)
  });

  await Promise.all([
    Project.findByIdAndUpdate(project._id, { $addToSet: { tasks: task._id } }),
    Activity.create({
      type: "TASK_CREATED",
      message: `${req.user!.name} assigned "${task.title}" to ${assignee.name}`,
      actor: req.user!._id,
      project: project._id,
      task: task._id
    })
  ]);

  const populatedTask = await Task.findById(task._id).populate(taskPopulate);

  res.status(201).json({
    success: true,
    task: populatedTask
  });
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { search, status, priority, project, sort } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> =
    req.user!.role === "Admin"
      ? {}
      : {
          $or: [{ assignedTo: req.user!._id }, { project: { $in: req.user!.assignedProjects } }]
        };

  if (search) {
    filter.$and = [
      ...(Array.isArray(filter.$and) ? filter.$and : []),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      }
    ];
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    deadline: { deadline: 1 },
    "-deadline": { deadline: -1 },
    priority: { priority: 1 },
    "-priority": { priority: -1 },
    createdAt: { createdAt: 1 },
    "-createdAt": { createdAt: -1 }
  };

  const tasks = await Task.find(filter)
    .populate(taskPopulate)
    .sort(sortMap[sort ?? "-createdAt"] ?? { createdAt: -1 });

  res.status(200).json({
    success: true,
    tasks
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id).populate(taskPopulate);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const project = task.project as unknown as { members: { _id: string }[] };
  const hasAccess =
    req.user!.role === "Admin" ||
    task.assignedTo._id.toString() === req.user!.id ||
    project.members.some((member) => member._id.toString() === req.user!.id);

  if (!hasAccess) {
    throw new ApiError(403, "You do not have access to this task");
  }

  res.status(200).json({
    success: true,
    task
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const isAssignedMember = task.assignedTo.toString() === req.user!.id;

  if (req.user!.role !== "Admin") {
    const requestedKeys = Object.keys(req.body);
    if (!isAssignedMember || requestedKeys.some((key) => key !== "status")) {
      throw new ApiError(403, "Members can only update the status of tasks assigned to them");
    }
  }

  const previousStatus = task.status;

  if (req.user!.role === "Admin") {
    if (req.body.project !== undefined || req.body.assignedTo !== undefined) {
      const nextProjectId = req.body.project ?? task.project.toString();
      const nextAssigneeId = req.body.assignedTo ?? task.assignedTo.toString();
      const { project, assignee } = await ensureAssignmentContext(nextProjectId, nextAssigneeId);

      if (task.project.toString() !== project.id) {
        await Promise.all([
          Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } }),
          Project.findByIdAndUpdate(project._id, { $addToSet: { tasks: task._id } })
        ]);
      }

      task.project = project._id;
      task.assignedTo = assignee._id;
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.deadline !== undefined) task.deadline = new Date(req.body.deadline);
  }

  if (req.body.status !== undefined) {
    task.status = req.body.status as TaskStatus;
  }

  await task.save();

  await Activity.create({
    type: task.status === "Completed" && previousStatus !== "Completed" ? "TASK_COMPLETED" : "TASK_UPDATED",
    message:
      task.status === "Completed" && previousStatus !== "Completed"
        ? `${req.user!.name} completed "${task.title}"`
        : `${req.user!.name} updated "${task.title}"`,
    actor: req.user!._id,
    project: task.project,
    task: task._id
  });

  const populatedTask = await Task.findById(task._id).populate(taskPopulate);

  res.status(200).json({
    success: true,
    task: populatedTask
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Promise.all([
    Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } }),
    Activity.create({
      type: "TASK_DELETED",
      message: `${req.user!.name} deleted "${task.title}"`,
      actor: req.user!._id,
      project: task.project
    })
  ]);

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully"
  });
});

