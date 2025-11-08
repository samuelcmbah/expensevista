import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import TransactionForm from "./TransactionForm"
import { useTransactionForm } from "../hooks/useTransactionForm"
import type { TransactionDTO } from "../types/transaction/TransactionDTO"
import { createTransaction, updateTransaction } from "../services/transactionService"
import toast from "react-hot-toast"

interface TransactionDialogProps {
  triggerLabel: React.ReactNode;//so it can be string or element
  initialData?: TransactionDTO | null
  onSubmitSuccess: () => void
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ triggerLabel, initialData, onSubmitSuccess }) => {

  const { formData, handleChange, getCreatePayload, getEditPayload, categories, loading, isEdit } =
    useTransactionForm({ initialData })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
        const toastId = toast.loading(isEdit ? "Updating transaction..." : "Adding transaction...");

    try {
      if (isEdit && initialData) {
        await updateTransaction(Number(initialData.id), getEditPayload());
        toast.success("Transaction updated successfully!", { id: toastId });
      } else {
        await createTransaction(getCreatePayload());
        toast.success("Transaction added successfully!", { id: toastId });
      }
      onSubmitSuccess()
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        //get all error messages and join them
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
    <Dialog>
      <DialogTrigger asChild>
        <button>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        <TransactionForm
          formData={formData}
          handleChange={handleChange}
          categories={categories}
          loading={loading}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? "Save Changes" : "Add Transaction"}
        />
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDialog
