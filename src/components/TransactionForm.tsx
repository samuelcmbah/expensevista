// src/components/TransactionForm.tsx
import React from "react";
import { TransactionType } from "../types/transaction/TransactionType";
import type { CategoryDTO } from "../types/Category/CategoryDTO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type CreateTransactionDTO from "../types/transaction/CreateTransactionDTO";
import type { EditTransactionDTO } from "../types/transaction/EditTransactionDTO";
import LoadingButton from "./ui/LoadingButton";


/* props */
interface TransactionFormProps {
  formData: CreateTransactionDTO | EditTransactionDTO;
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

  // defensive: produce safe strings for inputs
  const dateValue = formData.transactionDate ? String(formData.transactionDate).split("T")[0] : "";
  const amountValue = formData.amount.trim();
  const categoryValue =
    formData.categoryId === null || formData.categoryId === 0 ? "" : String(formData.categoryId);
  const descriptionValue = formData.description ?? "";

  const hasAmount = amountValue !== "";
  const hasType = formData.type !== null && formData.type !== undefined;
  const hasCategory = formData.categoryId !== null && formData.categoryId !== 0;

  const isFormValid = hasAmount && hasType && hasCategory; // true only when all required fields are filled


  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-black-600 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={descriptionValue}
          onChange={handleChange}
          className="w-full rounded-lg px-3 py-2 bg-gray-100 transition focus-within:outline-none focus-within:ring-2 focus-within:ring-green-200"
          placeholder="Optional description"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-black-600 mb-1">Amount</label>
        <input
          type="text"
          name="amount"
          value={amountValue}
          onChange={handleChange}
          className="w-full rounded-lg px-3 py-2 bg-gray-100 transition focus-within:outline-none focus-within:ring-2 focus-within:ring-green-200"
          required
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-black-600 mb-1">Type</label>
        <Select
          value={String(formData.type)}
          onValueChange={(value) =>
            handleChange({
              target: { name: "type", value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={String(TransactionType.Income)}>Income</SelectItem>
            <SelectItem value={String(TransactionType.Expense)}>Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-black-600 mb-1">Category</label>
        <Select
          value={categoryValue}
          onValueChange={(value) =>
            handleChange({
              target: { name: "categoryId", value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-black-600 mb-1">Date</label>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}//limit to today
          name="transactionDate"
          value={dateValue}
          onChange={handleChange}
          className="w-full rounded-lg px-3 py-2 bg-gray-100 transition focus-within:outline-none focus-within:ring-2 focus-within:ring-green-200"
        />
      </div>

      <LoadingButton
        type="submit"
        label={submitLabel}
        loading={loading}
        loadingLabel="Saving..."
        disabled={!isFormValid}
        className="bg-green-600 hover:bg-green-700 w-full"
      />

    </form>
  );
};

export default TransactionForm;
