// src/hooks/useTransactionForm.ts
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllCategories } from "../services/categoryService";
import { TransactionType } from "../types/transaction/TransactionType";
import type CreateTransactionDTO from "../types/transaction/CreateTransactionDTO";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import type { EditTransactionDTO } from "../types/transaction/EditTransactionDTO";

interface Category {
  id: number;
  categoryName: string;
}

interface UseTransactionFormProps {
  initialData?: TransactionDTO | null; // If provided, we’re editing
}

export const useTransactionForm = ({ initialData = null }: UseTransactionFormProps) => {
  // Make formData a union so both shapes are allowed
  const [formData, setFormData] = useState<CreateTransactionDTO | EditTransactionDTO>({
  id: 0,
  amount: "0",
  type: "",
  transactionDate: new Date().toISOString(),
  categoryId: "",
  description: "",
});

// update when initialData changes (e.g. after API fetch)
useEffect(() => {
  if (initialData) {
    setFormData({
      id: initialData.id,
      amount: initialData.amount,
      type: initialData.type,
      transactionDate: initialData.transactionDate,
      categoryId: initialData.category.id,
      description: initialData.description ?? "",
    });
  }
}, [initialData]);


  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        toast.error("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  //This function updates the form state (formData)
  //  whenever a user changes an input field in the transaction form.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // use a copy typed as any for easy updates (parent keeps strong types)
      const next = { ...(prev as any) };

      if (name === "amount") {
        next.amount = value === "" ? 0 : parseFloat(value);
        return next;
      }
      if (name === "type") {
        next.type = Number(value) as TransactionType;
        return next;
      }
      if (name === "transactionDate") {
        next.transactionDate = value ? new Date(value).toISOString() : "";
        return next;
      }
      if (name === "categoryId") {
        // DOM gives strings; keep numeric in state
        next.categoryId = value === "" ? 0 : Number(value);
        return next;
      }

      next[name] = value;
      return next;
    });
  };

  // helper to normalize/clean description
  const cleanedDescription = (desc?: string | null) =>
    desc?.trim && desc.trim().length > 0 ? desc.trim() : undefined;

  // explicit create payload
  const getCreatePayload = (): CreateTransactionDTO => {
    // formData may be union; cast safely
    const fd = formData as CreateTransactionDTO;
    return {
      amount: fd.amount,
      type: fd.type,
      transactionDate: fd.transactionDate,
      categoryId: fd.categoryId,
      description: cleanedDescription(fd.description),
    };
  };

  // explicit edit payload
  const getEditPayload = (): EditTransactionDTO => {
    // we assume either initialData exists or caller knows it's edit
    const fd = formData as EditTransactionDTO;
    // ensure id is present — prefer the id from initialData if available
    const id = (initialData && initialData.id) ?? (fd.id ?? 0);
    return {
      id,
      amount: fd.amount,
      type: fd.type,
      transactionDate: fd.transactionDate,
      categoryId: fd.categoryId,
      description: cleanedDescription(fd.description),
    };
  };

  const isEdit = Boolean(initialData);

  return {
    formData,
    setFormData,
    handleChange,
    getCreatePayload,
    getEditPayload,
    isEdit,
    categories,
    loading,
  };
};
