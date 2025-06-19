import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(atob(token.split(".")[1]));

    if (role && user?.type !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
