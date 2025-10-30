// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [loading, setLoading] = useState(false);
  const {logout} = useAuth();

  useEffect(() => {
    // Simulated API call
    const fetchData = async () => {
      const user = await getUserProfile();
      setFullName(user.fullName);
      setEmail(user.email);
      setMonthlyBudget(user.monthlyBudget);
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    await updateUserProfile({ fullName });
    setLoading(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBudgetUpdate = () => {
    setIsEditingBudget(false);
    alert(`Monthly budget updated to ₦${monthlyBudget.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100">
              Cancel
            </button>
          </div>
        </div>

        {/* Monthly Budget Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
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
              Monthly Budget: <span className="font-semibold">₦{monthlyBudget.toLocaleString()}</span>
            </p>
          )}
        </div>

        {/* Categories Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Categories</h2>
          <p className="text-sm text-gray-600">
            Manage your transaction categories from the Transactions page.
          </p>
        </div>

        {/* Logout */}
        <div className="text-center pt-6">
          <button
            onClick={handleLogout}
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
