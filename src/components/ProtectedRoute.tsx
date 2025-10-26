import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />; // Allow nested routes to render
}
