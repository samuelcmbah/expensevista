import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import { TransactionType } from "../types/transaction/TransactionType";
import { Plus, Search, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import {
  deleteTransaction,
  getFilteredPagedTransactions,
} from "../services/transactionService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getAllCategories } from "../services/categoryService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  //filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  // const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // fetch all categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setAllCategories(categories.map((cat) => cat.categoryName));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all or filtered transactions
  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching transactions...");

      try {
        const filters = {
          searchTerm: search || undefined, // ✅ matches C# DTO
          categoryName: categoryFilter !== "All" ? categoryFilter : undefined, // ✅ use name, not ID
          type:
            typeFilter === "All"
              ? undefined
              : typeFilter === "Income"
                ? TransactionType.Income
                : TransactionType.Expense,
          // startDate: startDate || undefined,
          endDate: endDate || undefined,
        };

        const data = await getFilteredPagedTransactions({
          page: currentPage,
          recordsPerPage,
          filters,
        });

        setTransactions(data.data);
        setTotalCount(data.totalRecords);
        toast.dismiss(toastId);
      } catch (error) {
        toast.error("Failed to fetch transactions", { id: toastId });
      }
    };

    fetchData();
  }, [currentPage, recordsPerPage, search, categoryFilter, typeFilter, endDate]);

  // ✅ Pagination
  const totalPages = Math.ceil(totalCount / recordsPerPage);


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

  // ✅ Safe formatAmount helper for string inputs
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);

    if (isNaN(num)) return amount; // fallback in case of invalid number

    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return num.toFixed(2).toLocaleString();

    return num.toFixed(2);
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {allCategories.length === 0 ? (
                <SelectItem value="none" disabled>No categories</SelectItem>
              ) : (
                allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

        </div>

        {/* Type Filter */}
        <div className="relative">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          {/* <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 text-gray-700 border border-transparent rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
          />
          <span className="text-gray-400">to</span> */}
          <input
            type="date"
            value={endDate}
            max={new Date().toISOString().split("T")[0]}//limit to today
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 text-gray-700 border border-transparent rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300"
          />
        </div>

      </div>



      {/* Card View (Animated) */}
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx, index) => {
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
        <p>
          Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
          {Math.min(currentPage * recordsPerPage, totalCount)} of {totalCount}{" "}
          transactions
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
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
