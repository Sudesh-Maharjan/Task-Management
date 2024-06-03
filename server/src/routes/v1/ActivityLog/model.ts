import mongoose, { Schema } from "mongoose";

export interface ActivityLog {
  action: string;
  timestamp: Date;
  userID: string;
}

const ActivityLogSchema: Schema<ActivityLog> = new Schema({
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userID: {
    type: String,
    required: true,
  },
});

const ActivityLog = mongoose.model<ActivityLog>("ActivityLog", ActivityLogSchema);
export default ActivityLog;
