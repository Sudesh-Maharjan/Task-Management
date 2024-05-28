// import React from 'react'
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const MyRoutes = () => {
  
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<DndProvider backend={HTML5Backend}><Home /></DndProvider>} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
};

export default MyRoutes;
