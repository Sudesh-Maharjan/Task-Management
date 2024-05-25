import mongoose, { Document, Schema } from "mongoose";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  createDate: Date;
  assigneeID: string;
  updateDate?: Date;
  tags: string[];
}

const taskSchema: Schema<Task> = new Schema({
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
  tags: [String],
},
);

const Task = mongoose.model<Task>("Task", taskSchema);
export default Task;
