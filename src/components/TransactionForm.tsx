// src/components/TransactionForm.tsx
import React from "react";
import { TransactionType } from "../types/transaction/TransactionType";
import type { CategoryDTO } from "../types/Category/CategoryDTO";



export interface FormValues {
  amount: number;
  type: TransactionType;
  transactionDate: string; // ISO string or empty
  categoryId: number | "" | null;
  description?: string | null;
}

/* props */
interface TransactionFormProps {
  formData: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  categories: CategoryDTO[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  formData,
  handleChange,
  categories,
  loading,
  onSubmit,
  submitLabel,
}) => {
  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  // defensive: produce safe strings for inputs
  const dateValue = formData.transactionDate ? String(formData.transactionDate).split("T")[0] : "";
  const amountValue = formData.amount !== undefined && formData.amount !== null ? String(formData.amount) : "0";
  const categoryValue = formData.categoryId === null || formData.categoryId === "" ? "" : String(formData.categoryId);
  const descriptionValue = formData.description ?? "";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-gray-600 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={descriptionValue}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Optional description"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-gray-600 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={amountValue}
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
          <option value={String(TransactionType.Income)}>Income</option>
          <option value={String(TransactionType.Expense)}>Expense</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-600 mb-1">Category</label>
        <select
          name="categoryId"
          value={categoryValue}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
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
          value={dateValue}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default TransactionForm;
