import { Request, Response, NextFunction } from 'express';
import Task from '../routes/v1/Tasks/model';
interface AuthenticatedRequest extends Request {
   user?: { id: string };
 }
 
export const checkTaskOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id; 
  const taskId = req.params.id;
  console.log(userId, taskId)

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assigneeID.toString() !== userId && task.assignerID.toString() !== userId){
      return res.status(403).json({ message: "You are not authorized to access this task" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
