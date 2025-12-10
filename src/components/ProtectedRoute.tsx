import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
    <>
      <div className="h-screen flex flex-col items-center justify-center py-24 text-gray-500 min-h-[300px]">
        <Loader2 className="animate-spin h-6 w-6 text-green-500" />
        <p className="text-gray-700 text-sm mt-4 font-medium">Loading...</p>
      </div>
    </>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
