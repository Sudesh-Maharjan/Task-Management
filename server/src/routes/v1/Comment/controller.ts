import { Request, Response } from "express";
import Task, {Task as TaskTypes} from "../Tasks/model";
import { StatusCodes } from "http-status-codes";
import Comment from '../Comment/model';

export const addComment = async (req: Request, res: Response)=> {
   const {taskId} = req.params; //taking Id of task from Task model.
   const { comment, author } = req.body;
   if (!comment || !author) {
      return res.status(StatusCodes.BAD_REQUEST).send("Comment and Author are required");
    }
    try {
      const newComment = await Comment.create({taskId, comment, author});
      await Task.findByIdAndUpdate(taskId, { $push: { comments: newComment._id } });
      res.status(StatusCodes.CREATED).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
};

export const getComments = async (req: Request, res: Response) => {
   const { taskId } = req.params;
 
   try {
     const task = await Task.findById(taskId);
     if (!task) {
       return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
     }
 
     const comments = await Comment.find({ taskId });
     res.json(comments);
   } catch (error) {
     console.error("Error fetching comments:", error);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
   }
 };

export const updateComment = async (req: Request, res: Response) => {
const {taskId, commentId} = req.params;
const updates = req.body;

try {
   const comment = await Comment.findById(commentId);
   if(!comment){
      return res.status(StatusCodes.NOT_FOUND).send("Comment not found");
   }
   if(!comment.taskId.equals(taskId)){
      return res.status(StatusCodes.BAD_REQUEST).send("Comment does not belong to task");
   }
   Object.assign(comment, updates);
   comment.updateDate = new Date();
   await comment.save();
   res.json(comment);
} catch (error: any) {
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
}
}

export const deleteComment = async (req: Request, res: Response) => {
const {taskId, commentId} = req.params;

try {
   const comment = await Comment.findById(commentId);
   if(!comment){
      return res.status(StatusCodes.NOT_FOUND).send("Comment not found");
   }
   if(!comment.taskId.equals(taskId)){

      return res.status(StatusCodes.BAD_REQUEST).send("Comment does not belong to task");
    }
    await comment.save();
    await Task.findByIdAndUpdate(taskId, { $pull: { comments: commentId } });
    res.json({ message: "Comment deleted successfully." });
} catch (error) {
   console.error("Error deleting comment:", error);
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
}
}