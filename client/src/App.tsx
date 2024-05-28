// import { useState } from 'react'

import { useEffect, useState } from 'react';
import './App.css'
import MyRoutes from './MyRoutes'
import axiosInstance from './Auth/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDropupCircle } from "react-icons/io";
const App = () => {

  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);
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

    const exceptions = ['/register']; // Add more paths if needed

    if (!exceptions.includes(location.pathname)) {
      checkAuth();
    }
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate, location]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
   <>
   <MyRoutes/>
   {showScrollButton && (
        <button
          className="fixed bottom-6 left-6 bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-full"
          onClick={scrollToTop}
        >
         <IoIosArrowDropupCircle className='text-2xl'/>
        </button>
      )}
   </>
  )
};

export default App;
