// src/pages/EditTransaction.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getTransactionById,
  updateTransaction,
} from "../services/transactionService";
import { getAllCategories } from "../services/categoryService.ts"; 
import { TransactionType } from "../types/transaction/TransactionType.ts";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import type { EditTransactionDTO } from "../types/transaction/EditTransactionDTO";

interface Category {
  id: number;
  categoryName: string;
}

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TransactionDTO | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch transaction and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        setLoading(true);
        const [transaction, categoryList] = await Promise.all([
          getTransactionById(Number(id)),
          getAllCategories(),
        ]);

        if (transaction?.transactionDate) {
          transaction.transactionDate =
            typeof transaction.transactionDate === "string"
              ? transaction.transactionDate
              : new Date(transaction.transactionDate).toISOString();
        }

        setFormData(transaction);
        setCategories(categoryList);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load transaction or categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // tracks when a particular field changes and updates the formData state accordingly
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;

    if (name === "amount") {
      setFormData({
        ...formData,
        amount: value === "" ? 0 : parseFloat(value),
      });
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
      setFormData({
        ...formData,
        category: { ...(formData.category ?? {}), id: Number(value) },
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    const payload: EditTransactionDTO = {
      id: Number(id),
      amount: formData.amount,
      type: formData.type,
      transactionDate: formData.transactionDate,
      categoryId: formData.category?.id ?? 0,
      description: formData.description ?? "",
    };

    const toastId = toast.loading("Updating transaction...");
    try {
      await updateTransaction(Number(id), payload);
      toast.success("Transaction updated successfully!", { id: toastId });
      navigate("/transactions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction.", { id: toastId });
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  if (!formData)
    return (
      <p className="text-center mt-8 text-gray-500">
        Transaction not found.
      </p>
    );

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description ?? ""}
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
            value={formData.amount?.toString() ?? "0"}
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
            value={String(formData.type ?? "")}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value={TransactionType.Income}>Income</option>
            <option value={TransactionType.Expense}>Expense</option>
          </select>
        </div>

        {/* Category dropdown */}
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.category?.id ?? ""}
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
            value={
              formData.transactionDate
                ? formData.transactionDate.split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;
