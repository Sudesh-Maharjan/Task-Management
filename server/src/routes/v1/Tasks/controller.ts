import { Request, Response } from "express";
import Task, { Task as TaskType } from "./model";
import { StatusCodes } from "http-status-codes";

let tasks: TaskType[] = [];
let currentId = 1;

export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, assigneeID, tags, status } = req.body;

  if (!title || !description) {
    return res.status(400).send("Title and Description is required");
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
    tags: tags || [],
    status: taskStatus,
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
  
  try {
    let query = {};

    if (tags) {
      const tagsArray = (tags as string).split(',').map(tag => tag.trim());
      query = { ...query, tags: { $all: tagsArray.map(tag => new RegExp(tag, 'i')) } };
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query = { 
        ...query, 
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ] 
      };
    }

    let tasks = await Task.find(query);

    // Sorting tasks by priority
    tasks.sort((a, b) => {
      const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
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
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return res.status(404).send("Task not found");
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
};
