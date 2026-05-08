import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export type ActivityType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_COMPLETED"
  | "TASK_DELETED";

export interface IActivity {
  type: ActivityType;
  message: string;
  actor: Types.ObjectId;
  project?: Types.ObjectId;
  task?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IActivityDocument extends IActivity, Document {}

const activitySchema = new Schema<IActivityDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "PROJECT_CREATED",
        "PROJECT_UPDATED",
        "PROJECT_DELETED",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_COMPLETED",
        "TASK_DELETED"
      ]
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ project: 1 });

export const Activity: Model<IActivityDocument> =
  mongoose.models.Activity ?? mongoose.model<IActivityDocument>("Activity", activitySchema);
