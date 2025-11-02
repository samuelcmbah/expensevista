import React, { useState, useEffect } from "react";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getBudgetStatus, updateMonthlyBudget } from "../services/budgetServices";
import type { CategoryDTO } from "../types/Category/CategoryDTO";
import { createCategory, deleteCategory, getAllCategories } from "../services/categoryService";
import type { CreateCategoryDTO } from "../types/Category/CreateCategoryDTO";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { User, Wallet2, Tags, LogOut, Plus } from "lucide-react";

const Settings: React.FC = () => {
  const { logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetId, setBudgetId] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [newCategory, setNewCategory] = useState("");

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

  useEffect(() => {
    // Fetch categories if needed in future
    loadcategories();
  }, []);
  
  
  const loadcategories = async () => {
    try {
      // Placeholder for fetching categories if needed
      const data = await getAllCategories();
      setCategories(data);
    }catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      const payload: CreateCategoryDTO = { categoryName: newCategory };
      const category = await createCategory(payload);

      setCategories([...categories, category]);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const toastId = "delete-category";
    toast.loading("Deleting category...",{ id: toastId });
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category deleted", { id: toastId });
    }catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      if(axiosError.response?.status === 400){
        toast.error("Cannot delete category with existing transactions", { id: toastId });
      }else{
        toast.error("Failed to delete category", { id: toastId });
      }
    }
  };





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

      {/* 👤 Profile Section */}
      <motion.div
        className="bg-gradient-to-r from-green-25 to-green-50 p-6 rounded-2xl shadow-sm border border-blue-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="text-green-600 w-5 h-5" />
          <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              disabled
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
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
              disabled
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2"
              value={email}
              readOnly
            />
          </div>
        </div>
      </motion.div>

      {/* 💰 Monthly Budget Section */}
      <motion.div
        className="bg-gradient-to-r from-green-25 to-green-50 p-6 rounded-2xl shadow-sm border border-green-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet2 className="text-green-600 w-5 h-5" />
            <h2 className="text-lg font-medium text-gray-800">Monthly Budget</h2>
          </div>
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="text-green-700 hover:underline text-sm font-medium"
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
              className="bg-green-700 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition"
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
      </motion.div>

      {/* 🏷️ Categories Section */}
      <motion.div
        className="bg-gradient-to-r from-green-25 to-green-50 p-6 rounded-2xl shadow-sm border border-indigo-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Tags className="text-green-600 w-5 h-5" />
          <h2 className="text-lg font-medium text-gray-800">Categories</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Manage your transaction categories
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2  focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-700 hover:bg-purple-600 text-white rounded-sm px-4 py-2"
          >
            <Plus size={18} className="md:mr-1" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 bg-white text-gray-800 px-3 py-1 rounded-lg shadow-sm"
            >
              {cat.categoryName}
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-gray-500 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🚪 Logout */}
      <div className="text-center pt-6">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium border border-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  </div>
);

};

export default Settings;
