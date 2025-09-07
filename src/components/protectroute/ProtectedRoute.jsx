// src/components/protectroute/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    // Token expired check
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

    // Role check (make sure your token has role info inside it!)
    const userRole =
      decoded.role || decoded.roleName || decoded?.roleId?.roleName;

    // console.log("Decoded JWT role:", userRole);
    // console.log("Allowed role:", allowedRole);

    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/login" replace />; // Redirect unauthorized users
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
