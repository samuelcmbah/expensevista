import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (fixed on large screens, overlay on mobile) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Navbar (mobile only) */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Section */}
        <div className="relative flex-1 flex flex-col">

          <Outlet />

        </div>
      </div>
    </div>
  );
}
