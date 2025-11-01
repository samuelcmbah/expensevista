import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Transactions from "../pages/Transactions";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import EditTransaction from "../pages/EditTransaction";
import AddTransaction from "../pages/AddTransaction";
import { ReportsAnalytics } from "../pages/Reports";
import Welcome from "../pages/Welcome";


export default function AppRoutes() {
  return (

    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}