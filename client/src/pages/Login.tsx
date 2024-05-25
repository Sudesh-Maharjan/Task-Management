import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/Auth/AxiosInstance';
import {
  Form,
  FormField,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  console.log(showLoginSuccess);
  const form = useForm<LoginFormData>({
   
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axiosInstance.post('users/login', data);
      const { accessToken, refreshToken } = response.data;
  // document.cookie = `accessToken=${accessToken};`;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

      console.log('Login successful:', response.data);
      toast.success('Login successful!');
      setShowLoginSuccess(true);
      setTimeout(() => {
        setShowLoginSuccess(false);
        navigate('/home');
      }, 2000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || 'Login failed! Please check your credentials.');
      } else {
        toast.error('Login failed! Please try again later.');
      }
    }
  };


  return (
    <div className="relative flex justify-center items-center min-h-screen bg-purple-300">
      {/* Animated Cubes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="cube">
          <div className="cube__face cube__face--front"></div>
          <div className="cube__face cube__face--back"></div>
          <div className="cube__face cube__face--right"></div>
          <div className="cube__face cube__face--left"></div>
          <div className="cube__face cube__face--top"></div>
          <div className="cube__face cube__face--bottom"></div>
        </div>
        <div className="cube">
          <div className="cube__face cube__face--front"></div>
          <div className="cube__face cube__face--back"></div>
          <div className="cube__face cube__face--right"></div>
          <div className="cube__face cube__face--left"></div>
          <div className="cube__face cube__face--top"></div>
          <div className="cube__face cube__face--bottom"></div>
        </div>
        <div className="cube">
          <div className="cube__face cube__face--front"></div>
          <div className="cube__face cube__face--back"></div>
          <div className="cube__face cube__face--right"></div>
          <div className="cube__face cube__face--left"></div>
          <div className="cube__face cube__face--top"></div>
          <div className="cube__face cube__face--bottom"></div>
        </div>
      </div>

      {/* Animated Bouncing Balls */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div>


    
      <div className="p-5 bg-white bg-opacity-80 rounded-md shadow-lg relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6 w-[400px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input placeholder="Email" {...field} className='w-full' />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input type="password" placeholder="Password" {...field} className='w-full' />
              )}
            />
            <div className="flex justify-center">
              <Button variant={'purple'} type ="submit" className='w-full'>Login</Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <a href="/register" className="text-purple-600 hover:underline">Register?</a>
        </div>
      <Toaster />
      </div>
    </div>
  );
};

export default Login;
