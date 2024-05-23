import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const form = useForm<LoginFormData>({
   
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/login', data);
      console.log('Login successful:', response.data);
      toast.success('Login successful!');
      navigate('/home');
      // Navigate to the dashboard or home page after successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data || error.message);
        toast.error('Login failed!');
      } else {
        console.error('Login failed:', error);
        toast.error('Login failed!');
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
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
