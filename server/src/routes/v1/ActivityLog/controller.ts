import { Request, Response } from "express";
import ActivityLog from "../ActivityLog/model";
import { StatusCodes } from "http-status-codes";

export const createActivityLog = async (req: Request, res: Response) => {
  const { action } = req.body;
  if (!action) {
    return res.status(400).send("Action is required");
  }

  try {
    const newActivityLog = new ActivityLog({ action, timestamp: new Date() });
    await newActivityLog.save();

    const count = await ActivityLog.countDocuments();
    //keeping only 10 logs in the database to not make it cluttered.
    if(count > 10){
      const logsToDelete = await ActivityLog.find().sort({ timestamp: 1 }).limit(count - 10);//checking if the count is greater than 10
      const deletePromises = logsToDelete.map(log => ActivityLog.deleteOne({ _id: log._id }));//if yes then delete by log by the id.
      await Promise.all(deletePromises);
      
    }
    res.status(StatusCodes.CREATED).json(newActivityLog);
  } catch (error) {
    console.error("Error creating activity log:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).send("Internal Server Error");
  }
};
