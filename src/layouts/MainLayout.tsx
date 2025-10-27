import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 p-6 transition-all">
        <Outlet />
      </main>
    </div>
  );
}
