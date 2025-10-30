import React, { useState, useEffect } from "react";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getBudgetStatus, updateMonthlyBudget } from "../services/budgetServices";

const Settings: React.FC = () => {
  const { logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetId, setBudgetId] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserProfile();
        setFullName(user.fullName);
        setEmail(user.email);

        const budget = await getBudgetStatus();
        setMonthlyBudget(budget.monthlyLimit);
        setBudgetId(budget.id);
      } catch {
        toast.error("Failed to load user or budget data");
      }
    };
    fetchData();
  }, []);




  const handleBudgetUpdate = async () => {
    if (!budgetId) {
      toast.error("Budget ID is missing");
      return;
    }
    const toastId = "budget-update";
    toast.loading("Updating monthly budget...", { id: toastId });

    try {
      setIsEditingBudget(true);

      const currentMonth = new Date().toISOString().slice(0, 7) + "-01"; // e.g. 2025-10-01

      await updateMonthlyBudget(budgetId, {
        id: budgetId!,
        monthlyLimit: monthlyBudget,
        budgetMonth: currentMonth,
      });

      toast.success(`Monthly budget updated to ₦${monthlyBudget.toLocaleString()}`, {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to update budget", { id: toastId });
    } finally {
      setIsEditingBudget(false);
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Profile Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"
                value={fullName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2"
                value={email}
                readOnly
              />
            </div>
          </div>
        </div>


        {/* Monthly Budget Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-800">
              Monthly Budget
            </h2>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-green-600 hover:underline text-sm"
            >
              {isEditingBudget ? "Close" : "Edit"}
            </button>
          </div>

          {isEditingBudget ? (
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleBudgetUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-gray-700 text-base">
              Monthly Budget:{" "}
              <span className="font-semibold">
                ₦{monthlyBudget.toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* Categories Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Categories</h2>
          <p className="text-sm text-gray-600">
            Manage your transaction categories from the Transactions page.
          </p>
        </div>

        {/* Logout */}
        <div className="text-center pt-6">
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-700 font-medium border border-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
