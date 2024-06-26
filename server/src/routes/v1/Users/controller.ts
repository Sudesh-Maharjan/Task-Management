import {Request, Response} from 'express';
import User from './model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from './service';
import { access } from 'fs';
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const validateEmail = (email: string): boolean => {
   return emailRegex.test(email);
 };
 
 export const validatePassword = (password: string): boolean => {
   return passwordRegex.test(password);
 };
export const sendOtp = async (req: Request, res: Response) => {
   const { email } = req.body;
      if (!validateEmail(email)) {
        return res.status(400).send('Email does not meet the requirements');
      }
   try {
     const existingUser = await User.findOne({ email });
     if (existingUser && existingUser.isVerified) {
       return res.status(400).send('User already exists and is verified');
     }
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     const otpExpires = new Date(Date.now() + 3600000);
 
     if (existingUser) {
       existingUser.otp = otp;
       existingUser.otpExpires = otpExpires;
       await existingUser.save();
     } else {
       const newUser = new User({
         email,
         otp,
         otpExpires,
      
       });
       await newUser.save();
     }
 
     await sendOtpEmail(email, otp);
     res.status(201).send('OTP sent to email');
   } catch (error) {
     console.error('Error in sendOtp:', error);
     res.status(500).send('Server error');
   }
 };
export const register = async (req: Request, res: Response) => {
   const { email, password, otp, firstName, lastName} = req.body;

   if (!password) {
      return res.status(400).send('Password is required');
    }
    if (!validatePassword(password)) {
      return res.status(400).send('Password does not meet requirements');
    }
    if (!firstName) {
      return res.status(400).send('First name is required');
   }
   if (!lastName) {
      return res.status(400).send('Last name is required');
   }
   try{
const user = await User.findOne({email});
if(!user) return res.status(400).send('User not found');


if (!validatePassword(password)) {
   return res.status(400).send('Password does not meet requirements');
 }

if (!user.otp || !user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
   return res.status(400).send('Invalid or expired OTP');
 }

const hashedPassword = await bcrypt.hash(password, 10);

user.password = hashedPassword;
user.firstName = firstName;
user.lastName = lastName;
user.isVerified = true;
user.otp = undefined;
user.otpExpires = undefined;

await user.save();
res.status(201).send('Registration Success full!');
   }catch(error: any){
      if (error.code === 11000 && error.keyPattern?.firstName === 1) {
         return res.status(400).send('A user with this first name already exists');
       }
       if (error.keyPattern?.lastName === 1) {
         return res.status(400).send('A user with this last name already exists');
       }
      console.error('Error in register:', error)
      res.status(500).send('Server error');
   }
};

export const login = async (req: Request, res: Response) => {
   const {email, password} = req.body;

   try{
const user = await User.findOne({email});
if(!user) return res.status(400).send('User not found');
if(!user.isVerified) return res.status(400).send('User not verified');

const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch) return res.status(400).send('Invalid credentials');
const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
   expiresIn: '1h'
});

const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'refreshsecret', {
   expiresIn: '7d'
});
//set token to cookies
res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiration
res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 604800000 }); // 7 days expiration
res.status(200).json({accessToken, refreshToken, user: {firstName: user.firstName, lastName: user.lastName, email: user.email}});

   }catch(error){
res.status(500).send('Server error');
   }
};

//get all the users name and email
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'firstName lastName email');
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};
//Assigned users
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.assigneeID;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getColorPreferences = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id; // Assuming user ID is available in the request

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const { pendingColor, inProgressColor, completedColor } = user;
    res.status(200).json({ pendingColor, inProgressColor, completedColor });
  } catch (error) {
    console.error("Error fetching color preferences:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const saveColorPreferences = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { pendingColor, inProgressColor, completedColor } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.pendingColor = pendingColor;
    user.inProgressColor = inProgressColor;
    user.completedColor = completedColor;

    await user.save();
    res.status(200).send('Color preferences saved');
  } catch (error) {
    console.error("Error saving color preferences:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Profile details
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
};
