import mongoose, { Schema } from "mongoose";

interface User {
  _id: string;
   firstName: string;
   lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  pendingColor?: string;     
  inProgressColor?: string;   
  completedColor?: string;  
}

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    unique: true,
  },
  lastName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  pendingColor: {
    type: String,
  },
  inProgressColor: {
    type: String,
  },
  completedColor: {
    type: String,
  },
});

const User = mongoose.model<User>("User", userSchema);
export default User;
