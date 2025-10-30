// ✅ src/pages/AddTransaction.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createTransaction } from "../services/transactionService";
import { getAllCategories } from "../services/categoryService";
import { TransactionType } from "../types/transaction/TransactionType";
import type CreateTransactionDTO from "../types/transaction/CreateTransactionDTO";
interface Category {
  id: number;
  categoryName: string;
}

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CreateTransactionDTO>({
    amount: 0,
    type: TransactionType.Expense,
    transactionDate: new Date().toISOString(),
    categoryId: 0,
    description: "",
  });

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setFormData({ ...formData, amount: value === "" ? 0 : parseFloat(value) });
      return;
    }

    if (name === "type") {
      setFormData({ ...formData, type: Number(value) as TransactionType });
      return;
    }

    if (name === "transactionDate") {
      const iso = value ? new Date(value).toISOString() : "";
      setFormData({ ...formData, transactionDate: iso });
      return;
    }

    if (name === "categoryId") {
      setFormData({ ...formData, categoryId: Number(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.categoryId) {
      toast.error("Please fill in all fields.");
      return;
    }

    const toastId = toast.loading("Adding transaction...");
    try {
      await createTransaction(formData);
      toast.success("Transaction added successfully!", { id: toastId });
      navigate("/transactions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction.", { id: toastId });
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-600 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount.toString()}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-600 mb-1">Type</label>
          <select
            name="type"
            value={String(formData.type)}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value={TransactionType.Income}>Income</option>
            <option value={TransactionType.Expense}>Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-600 mb-1">Date</label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate.split("T")[0]}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
