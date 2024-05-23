//yesle check garxa if the user is authenticated before allowing access to routes.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
   return <Navigate to="/" />;
 }

  return element;
};

export default ProtectedRoute;
