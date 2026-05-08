import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IProject {
  title: string;
  description: string;
  members: Types.ObjectId[];
  tasks: Types.ObjectId[];
  deadline: Date;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Project title must be at least 3 characters"],
      maxlength: [120, "Project title must be less than 120 characters"]
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [1200, "Description must be less than 1200 characters"]
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    deadline: {
      type: Date,
      required: [true, "Project deadline is required"]
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ members: 1 });
projectSchema.index({ createdBy: 1 });

export const Project: Model<IProjectDocument> =
  mongoose.models.Project ?? mongoose.model<IProjectDocument>("Project", projectSchema);
