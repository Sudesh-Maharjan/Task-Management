import {Request, Response} from 'express';
import User from './model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from './service';

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
   }catch(error){
      console.error('Error in register:', error)
      res.status(500).send('Server error');
   }
};


// export const verifyOtp = async (req: Request, res: Response) => {
//    const {email, otp} = req.body;

//    try{
//       const user = await User.findOne({email});
//       if(!user) return res.status(400).send('User not found');
// //checking the user entered otp
//       if(!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()){
//          return res.status(400).send('Invalid or expired OTP');
//       }

//       user.isVerified = true;
//       user.otp = undefined;
//       user.otpExpires = undefined;
//       await user.save();
//       res.status(200).send('User verified');
//    }catch{
// res.status(500).send('Server error');
//    }
// }

export const login = async (req: Request, res: Response) => {
   const {email, password} = req.body;

   try{
const user = await User.findOne({email});
if(!user) return res.status(400).send('User not found');
if(!user.isVerified) return res.status(400).send('User not verified');

const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch) return res.status(400).send('Invalid credentials');
const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || 'secret',{
   expiresIn: '1h'
});
// res.status(200).json('Logged In successfully!');
res.status(200).json({token});

   }catch(error){
res.status(500).send('Server error');
   }
};