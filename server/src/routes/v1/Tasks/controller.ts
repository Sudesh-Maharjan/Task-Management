import { Request, Response } from "express";
import Task, { Task as TaskType } from "./model";

let tasks: TaskType[] = [];
let currentId = 1;

export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, assigneeID, tags } = req.body;

  if (!title || !description) {
    return res.status(400).send("Title and Description is required");
  }
  const task: TaskType = {
    id: currentId++,
    title,
    description,
    dueDate,
    priority,
    createDate: new Date(),
    assigneeID,
    tags: tags || [],
  };

  try {
    const newTask = await Task.create(task);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { tag } = req.query;
  try {
    let tasks;
    if (tag) {
      tasks = await Task.find({
        $or: [
          { tags: tag as string },
          { title: { $regex: tag as string, $options: "i" } },
          { description: { $regex: tag as string, $options: "i" } },
        ],
      });
    } else {
      tasks = await Task.find();
    }
    //sorting tasks
    tasks.sort((a, b) => {
      const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
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
  const taskId = req.params.id;
  const { title, description, dueDate, priority, assigneeID, tags } = req.body;
  try {
    let task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.assigneeID = assigneeID;
    task.updateDate = new Date();
    task.tags = tags || [];

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Internal Server Error");
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
