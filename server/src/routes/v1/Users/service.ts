import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
   service: 'Gmail',
   host: "sudechii.m@gmail.com",
   secure: false,
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS
   }
 });
 
 export const sendOtpEmail = async (email: string, otp: string) => {
   const mailOptions = {
     from: process.env.EMAIL_USER,
     to: email,
     subject: 'Your OTP Code',
     text: `Your OTP code is ${otp}`
   };

   try{
      await transporter.sendMail(mailOptions);
      console.log('OTP sent to email');
   } catch (error) {
     console.error('Error sending OTP email', error);
   }
   }