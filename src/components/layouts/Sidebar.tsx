// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { List, BarChart3, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Transactions", path: "/transactions", icon: <List size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const activeClass =
    "bg-green-50 text-green-700 font-semibold border-l-4 border-green-500";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar container*/}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm z-50 
          transform transition-transform duration-300 
          md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-6 shadow-sm">
          <img
            src="/logo.png"
            alt="ExpenseVista Logo"
            className="h-10 w-10 rounded-full mb-2"
          />
          <h1 className="text-lg font-bold text-gray-800">ExpenseVista</h1>
          <p className="text-xs text-gray-500">Finance Tracker</p>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 flex flex-col space-y-1 ">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-6 py-2 text-sm transition-colors ${isActive
                  ? activeClass
                  : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full rounded-tl-lg rounded-tr-lg shadow-sm py-3">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-6 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            © 2025 ExpenseVista
          </p>
        </div>
      </aside>
    </>
  );
}
