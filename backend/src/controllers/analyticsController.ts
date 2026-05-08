import type { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { Project } from "../models/Project";
import { Task, type TaskPriority, type TaskStatus } from "../models/Task";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

const statuses: TaskStatus[] = ["Todo", "In Progress", "Completed"];
const priorities: TaskPriority[] = ["Low", "Medium", "High"];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === "Admin";
  const projectFilter = isAdmin ? {} : { members: req.user!._id };
  const taskFilter = isAdmin
    ? {}
    : { $or: [{ assignedTo: req.user!._id }, { project: { $in: req.user!.assignedProjects } }] };

  const [projects, tasks, activities, users] = await Promise.all([
    Project.find(projectFilter).select("title deadline members tasks").populate("tasks", "status"),
    Task.find(taskFilter).populate("assignedTo", "name email role").populate("project", "title"),
    Activity.find(isAdmin ? {} : { project: { $in: req.user!.assignedProjects } })
      .populate("actor", "name email role")
      .populate("project", "title")
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .limit(12),
    isAdmin ? User.find().select("name email role assignedProjects") : Promise.resolve([])
  ]);

  const now = new Date();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const overdueTasks = tasks.filter(
    (task) => task.status !== "Completed" && new Date(task.deadline).getTime() < now.getTime()
  );

  const statusBreakdown = statuses.map((status) => ({
    name: status,
    value: tasks.filter((task) => task.status === status).length
  }));

  const priorityBreakdown = priorities.map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length
  }));

  const completionTrend = Array.from({ length: 7 }).map((_, index) => {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() - (6 - index));
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      completed: tasks.filter((task) => {
        const updatedAt = task.updatedAt ?? task.createdAt ?? new Date(0);
        return task.status === "Completed" && updatedAt >= date && updatedAt < nextDay;
      }).length
    };
  });

  const projectProgress = projects.map((project) => {
    const projectTasks = project.tasks as unknown as { status: TaskStatus }[];
    const done = projectTasks.filter((task) => task.status === "Completed").length;
    const total = projectTasks.length;

    return {
      id: project.id,
      title: project.title,
      progress: total === 0 ? 0 : Math.round((done / total) * 100),
      totalTasks: total,
      completedTasks: done,
      deadline: project.deadline
    };
  });

  const workload = isAdmin
    ? users.map((user) => ({
        name: user.name,
        assigned: tasks.filter((task) => task.assignedTo?._id.toString() === user.id).length,
        completed: tasks.filter(
          (task) => task.assignedTo?._id.toString() === user.id && task.status === "Completed"
        ).length
      }))
    : [];

  res.status(200).json({
    success: true,
    analytics: {
      stats: {
        totalTasks,
        completedTasks,
        activeProjects: projects.length,
        overdueTasks: overdueTasks.length,
        completionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
      },
      statusBreakdown,
      priorityBreakdown,
      completionTrend,
      projectProgress,
      workload,
      overdue: overdueTasks.slice(0, 6),
      activities
    }
  });
});
