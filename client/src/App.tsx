// import { useState } from 'react'

import { useEffect } from 'react';
import './App.css'
import MyRoutes from './MyRoutes'
import axiosInstance from './Auth/AxiosInstance';
import { useNavigate } from 'react-router-dom';
const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post('/users/refresh-token', { token: refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          navigate('/home');
        } catch (err) {
          console.error('Failed to refresh token', err);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
   <>
   <MyRoutes/>
   </>
  )
};

export default App;
