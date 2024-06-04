import mongoose, { Document, Schema } from "mongoose";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  createDate: Date;
  assigneeID: mongoose.Types.ObjectId;
  assignerID: mongoose.Types.ObjectId; 
  updateDate?: Date;
  tags: string[];
  status: "pending" | "in-progress" | "completed";
  comments: string[];
  color?: {
    pending: string;
    inProgress: string;
    completed: string;
  };
}

const TaskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
  },
  assigneeID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignerID: { 
    type: Schema.Types.ObjectId,
    required: true },
  tags: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Task = mongoose.model<Task>("Task", TaskSchema);
export default Task;
