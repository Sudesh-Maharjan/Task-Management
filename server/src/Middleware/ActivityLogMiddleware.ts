import { Request, Response, NextFunction } from 'express';
import ActivityLog from '../routes/v1/ActivityLog/model';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const checkActivityLogOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const logId = req.params.id;

  try {
    const log = await ActivityLog.findById(logId);

    if (!log) {
      return res.status(404).json({ message: "Activity log not found" });
    }

    if (log.userID !== userId) {
      return res.status(403).json({ message: "You are not authorized to access this activity log" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
