import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Transactions from "../pages/Transactions";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import { ReportsAnalytics } from "../pages/Reports";
import Welcome from "../pages/Welcome";
import VerifyEmailSent from "./VerifyEmailSent";
import VerifyEmail from "./VerifyEmail";
import Login from "../pages/Login";
import Register from "../pages/Register";


export default function AppRoutes() {
  return (

    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
      <Route path="/verify-email" element={<VerifyEmail />} />


      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}