// import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./Auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const MyRoutes = () => {
  
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element = { <ProtectedRoute element={<Home />} />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default MyRoutes;
