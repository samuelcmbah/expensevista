import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import { TransactionType } from "../types/transaction/TransactionType";
import { Plus, Search, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import {
  deleteTransaction,
  getAllTransactions,
} from "../services/transactionService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ✅ Fetch all transactions
  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching transactions");

      try {
        const data = await getAllTransactions();
        setTransactions(data);
        toast.dismiss(toastId);
      } catch (error) {
        toast.error("Failed to fetch transactions", { id: toastId });
      }


    };
    fetchData();
  }, []);

  // ✅ Helper to convert enum number → string
  const getTypeLabel = (type: number) => {
    return type === TransactionType.Income ? "Income" : "Expense";
  };

  // ✅ Filters
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.category?.categoryName.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || tx.category?.categoryName === categoryFilter;

    const matchesType =
      typeFilter === "All" || getTypeLabel(tx.type) === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // ✅ Handlers
  const handleEdit = (id: number) => {
    toast("Editing transaction...", { icon: "✏️" });
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const toastId = toast.loading("Deleting transaction...");
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        toast.success("Transaction deleted!", { id: toastId });
      } catch (error) {
        toast.error("Failed to delete transaction.", { id: toastId });
      }
    }
  };

  // ✅ Format amount helper
  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(2) + "B";
    return amount.toLocaleString();
  };



  return (
    <div className="p-4 space-y-6">
      {/* ✅ Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <p className="text-gray-500 text-sm">Manage all your records</p>
        </div>

        <button
          onClick={() => navigate("/add-transaction")}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition active:scale-95"
        >
          <Plus size={18} className="md:mr-1" />
          <span className="hidden md:inline">Add Transaction</span>
        </button>
      </div>

      {/* ✅ Search & Filters */}
      <div className="bg-white p-3 shadow-sm rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 border border-gray-100">
        {/* Search */}
        <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 w-full focus-within:ring-2 focus-within:ring-green-100 transition">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by description or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-gray-50 text-gray-700 border border-transparent rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 cursor-pointer transition"
          >
            <option>All</option>
            {[...new Set(transactions.map((t) => t.category?.categoryName))].map(
              (cat) =>
                cat && (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
            )}
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7 7l3 3 3-3" />
          </svg>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-gray-50 text-gray-700 border border-transparent rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 cursor-pointer transition"
          >
            <option>All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7 7l3 3 3-3" />
          </svg>
        </div>
      </div>



      {/* Card View (Animated) */}
      <div className="space-y-3">
        {paginated.length > 0 ? (
          paginated.map((tx, index) => {
            const isIncome = tx.type === TransactionType.Income;
            const sign = isIncome ? "+" : "-";
            const color = isIncome ? "text-gray-600" : "text-gray-600";

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow flex items-center justify-between gap-4"
              >
                {/* ✅ Transaction Type Icon */}
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${tx.type === TransactionType.Income ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                  {tx.type === TransactionType.Income ? (
                    <ArrowUpCircle className="text-green-600 w-5 h-5" />
                  ) : (
                    <ArrowDownCircle className="text-red-600 w-5 h-5" />
                  )}
                </div>

                {/* ✅ Description and Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-normal truncate max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">
                    {tx.description && tx.description.length > 40
                      ? `${tx.description.slice(0, 37)}...`
                      : tx.description}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {tx.category?.categoryName || "—"} •{" "}
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </p>
                </div>

                {/* ✅ Amount and Actions */}
                <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0 text-right">
                  <p className={`font-medium ${color} text-sm sm:text-base break-all`}>
                    {sign}₦{formatAmount(tx.amount)}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(tx.id)}
                      className="text-gray-600 hover:text-green-600"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-gray-600 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>


            );
          })
        ) : (
          <p className="text-center py-6 text-gray-500 text-sm">
            No transactions found.
          </p>
        )}
      </div>

      {/* ✅ Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
        <p>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filtered.length)} of{" "}
          {filtered.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );


};

export default Transactions;
