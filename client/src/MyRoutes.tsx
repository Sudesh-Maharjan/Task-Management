// import React from 'react'
import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Profile from "./pages/Profile";
import Protected from "./Auth/ProtectedRoutes";
const MyRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route element={<Protected />}>
          <Route
            path="/home"
            element={
              <DndProvider backend={HTML5Backend}>
                <Home />
              </DndProvider>
            }
          />
          <Route
            path="/profile"
            element={
              <DndProvider backend={HTML5Backend}>
                <Profile />
              </DndProvider>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default MyRoutes;
