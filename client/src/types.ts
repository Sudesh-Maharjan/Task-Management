import ActivityLog from './components/ActivityLog';
//Task model
export interface Task {
   id: number;
   title: string;
   description: string;
   dueDate: string;
   priority:  "high" | "medium" | "low";
   createDate: Date;
   assigneeID: string;
   updateDate?: Date;
   tags: string[];
   status: "pending" | "in-progress" | "completed";
    color?: {
     pending: string;
     inProgress: string;
     completed: string;
   };
 }
 export interface TaskWithAssignedUser extends Task {
  assignedUser: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}
//User model
 export interface User {
  _id: string;
   firstName: string;
   lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
}
export interface ActivityLogEntry{
  timestamp: string;
  action: string;
}