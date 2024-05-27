import mongoose, { Document, Schema } from "mongoose";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority:  "high" | "medium" | "low";
  createDate: Date;
  assigneeID: string;
  updateDate?: Date;
  tags: string[];
  status: "pending" | "in-progress" | "completed";
}

const TaskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
    default: Date.now
  },
  updateDate: {
    type: Date,
  },
  assigneeID: {
    type: String,
  },
  tags: {type: [String], required: true},
  status: { type: String, enum: ["pending", "in-progress", "completed"], required: true

   }
  }
);

const Task = mongoose.model<Task>("Task", TaskSchema);
export default Task;
