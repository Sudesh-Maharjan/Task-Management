import mongoose, { Schema } from "mongoose";

export interface ActivityLog {
  action: string;
  timestamp: Date;
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
});

const ActivityLog = mongoose.model<ActivityLog>("ActivityLog", ActivityLogSchema);
export default ActivityLog;
