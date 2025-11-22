import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import TransactionForm from "./TransactionForm"
import { useTransactionForm } from "../../hooks/useTransactionForm"
import type { TransactionDTO } from "../../types/transaction/TransactionDTO"
import { createTransaction, updateTransaction } from "../../services/transactionService"
import toast from "react-hot-toast"
import useLoadingButton from "../../hooks/useLoadingButton"

interface TransactionDialogProps {
  triggerLabel: React.ReactNode;//so it can be string or element
  initialData?: TransactionDTO | null
  onSubmitSuccess: () => void
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ triggerLabel, initialData, onSubmitSuccess }) => {

  const [open, setOpen] = React.useState(false);
  const { formData, handleChange, getCreatePayload, getEditPayload, validateFields, categories, isEdit } =
    useTransactionForm({ initialData })
  const { loading, withLoading } = useLoadingButton();
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  validateFields();
  
  await withLoading(async () => {
    const toastId = toast.loading(isEdit ? "Updating transaction..." : "Adding transaction...");

    try {
      if (isEdit && initialData) {
        await updateTransaction(Number(initialData.id), getEditPayload());
        toast.success("Transaction updated successfully!", { id: toastId });
      } else {
        await createTransaction(getCreatePayload());
        toast.success("Transaction added successfully!", { id: toastId });
      }

      onSubmitSuccess();
      setOpen(false);
    } catch (error: any) {

      toast.error(
        isEdit ? "Failed to update transaction." : "Failed to add transaction.",
        { id: toastId }
      );
    }
  });
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
