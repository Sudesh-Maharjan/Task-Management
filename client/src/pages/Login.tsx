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
import { useAuth } from '@/Auth/AuthContext';
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const form = useForm<LoginFormData>({
   
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axiosInstance.post('/login', data);
      const { token } = response.data;
      console.log('Login successful:', response.data);
      toast.success('Login successful!');
      setShowLoginSuccess(true);
      setTimeout(() => {
        setShowLoginSuccess(false);
        navigate('/home');
      }, 2000);
  // Save token in cookies
  document.cookie = `accessToken=${token}; path=/;`;

      login(token);
      navigate('/home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || 'Login failed! Please check your credentials.');
      } else {
        toast.error('Login failed! Please try again later.');
      }
    }
  };


  return (
    <div className='flex justify-center items-center flex-col w-full mt-40'>
      <h1>Login</h1>
      <div className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6 border p-5 rounded-md w-[400px]">
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
              <Button type="submit" className='w-full'>Login</Button>
            </div>
          </form>
        </Form>
      <a href="/register">Register?</a>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
