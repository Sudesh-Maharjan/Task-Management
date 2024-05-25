// import React from 'react'
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

const MyRoutes = () => {
  
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
};

export default MyRoutes;
