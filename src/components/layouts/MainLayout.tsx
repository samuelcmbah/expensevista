import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll only when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    //cleanup, good practice
    return () => document.body.classList.remove("overflow-hidden");
  }, [sidebarOpen]);

  return (
    <div className="flex m-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* main scrolls independently */}
        <main className="flex-1 p-2 mt-14 md:mt-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
