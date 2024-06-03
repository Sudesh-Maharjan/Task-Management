import mongoose, { Schema, Types } from "mongoose";

export interface Comment {
  taskId: Types.ObjectId;
  comment: string;
  author: string;
  createDate: Date;
  updateDate?: Date;
}

const CommentSchema: Schema<Comment> = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  comment: { type: String, required: true },
  author: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date },
});

const Comment = mongoose.model<Comment>("Comment", CommentSchema);
export default Comment;
