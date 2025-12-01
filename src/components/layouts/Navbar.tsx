// src/components/Navbar.tsx
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm flex items-center justify-between px-4 py-3 z-40">
      {/* Left: Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
      >
        <Menu size={22} />
      </button>

      {/* Center: App Name */}
      <h1 className="text-lg font-semibold text-gray-800">ExpenseVista</h1>

      {/* Right: Avatar or Placeholder */}
      <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
        {user?.firstName ? user.firstName[0] : "U"}
      </div>
    </header>
  );
}
