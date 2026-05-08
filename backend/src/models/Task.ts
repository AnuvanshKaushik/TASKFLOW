import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: Types.ObjectId;
  project: Types.ObjectId;
  deadline: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskDocument extends ITask, Document {}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [140, "Task title must be less than 140 characters"]
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [1000, "Description must be less than 1000 characters"]
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    deadline: {
      type: Date,
      required: [true, "Task deadline is required"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ deadline: 1 });

export const Task: Model<ITaskDocument> =
  mongoose.models.Task ?? mongoose.model<ITaskDocument>("Task", taskSchema);
