import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import React from "react";

interface Props {
  onConfirm: () => void;
  trigger: React.ReactNode;
  loading?: boolean;
}

export default function DeleteConfirmationDialog({ onConfirm, trigger, loading }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>

        <p className="text-gray-700">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={handleConfirm}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
