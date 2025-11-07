import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createTransaction, getTransactionById, updateTransaction } from "../services/transactionService";
import { useTransactionForm } from "../hooks/useTransactionForm";
import TransactionForm from "../components/TransactionForm";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";

const TransactionPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<TransactionDTO | null>(null);

  // Determine if editing or creating
  const isEdit = Boolean(id);

  // Fetch existing transaction if editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchTransaction = async () => {
      try {
        const transaction = await getTransactionById(Number(id));
        setInitialData(transaction);
      } catch {
        toast.error("Failed to load transaction.");
      }
    };

    fetchTransaction();
  }, [isEdit, id]);

  const {
    formData,
    handleChange,
    getCreatePayload,
    getEditPayload,
    categories,
    loading,
  } = useTransactionForm({ initialData: initialData });

  // Handle submit (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading(isEdit ? "Updating transaction..." : "Adding transaction...");
    try {
      if (isEdit && id) {
        await updateTransaction(Number(id), getEditPayload());
        toast.success("Transaction updated successfully!", { id: toastId });
      } else {
        await createTransaction(getCreatePayload());
        toast.success("Transaction added successfully!", { id: toastId });
      }

      navigate("/transactions");
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join("\n");
        toast.error(messages, { id: toastId });
        return;
      }

      toast.error(isEdit ? "Failed to update transaction." : "Failed to add transaction.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <TransactionForm
        formData={formData}
        handleChange={handleChange}
        categories={categories}
        loading={loading}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Changes" : "Add Transaction"}
      />
    </div>
  );
};

export default TransactionPage;
