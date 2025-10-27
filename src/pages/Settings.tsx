import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <h1 className="font-semibold text-lg text-blue-600">ExpenseVista</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
