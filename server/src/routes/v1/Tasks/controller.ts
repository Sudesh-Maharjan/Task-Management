import { Request, Response } from "express";
import Task, { Task as TaskType } from "./model";
import { StatusCodes } from "http-status-codes";
import User from '../Users/model';
import { checkTaskOwnership } from "../../../Middleware/Authorization";
let tasks: TaskType[] = [];
let currentId = 1;

export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, assigneeID, tags, status } = req.body;
  const assignerID = (req as any).user?.id;
  if (!title || !description) {
    return res.status(400).send("Title , Description are required");
  }
  const taskStatus = status || "pending";
  const task: TaskType = {
    id: currentId++,
    title,
    description,
    dueDate,
    priority,
    createDate: new Date(),
    assigneeID,
    assignerID, 
    tags: tags || [],
    status: taskStatus,
    comments: [],
  };

  try {
    const newTask = await Task.create(task);
    res.status(StatusCodes.CREATED).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { tags, search } = req.query;
  const userId = (req as any).user?.id;
  
  try {
    let query: any = {
      $or: [
        { assigneeID: userId },
        { assignerID: userId }
      ]
    };
    if (tags) {
      const tagsArray = (tags as string).split(',').map(tag => tag.trim());
      query.tags = { $all: tagsArray.map(tag => new RegExp(tag, 'i')) };
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }
    let tasks = await Task.find(query);

    // Sorting tasks by priority
    tasks.sort((a, b) => {
      const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority ];
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

export const getTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  try {
    await checkTaskOwnership(req, res, async () => {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await checkTaskOwnership(req, res, async () => {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
    }
    delete updates.assignerID;
    const { status, ...otherUpdates } = updates;

    const updatedTaskData = status ? { ...otherUpdates, status } : otherUpdates;
    const updatedTask = await Task.findByIdAndUpdate(id, { ...updates, status }, { new: true });
    res.json(updatedTask);
  });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const userId = (req as any).user?.id;
  try {
    await checkTaskOwnership(req, res, async () => {
      const task = await Task.findById(taskId);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
    }
    if (task.assignerID.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to delete this task" });
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return res.status(404).send("Task not found");
    res.json({ message: "Task deleted successfully." });
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
};



