import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TransactionDTO } from "../types/TransactionDTO";
import { TransactionType } from "../types/TransactionType";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import {
  deleteTransaction,
  getAllTransactions,
} from "../services/transactionService";
import toast from "react-hot-toast";

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  // ✅ Fetch all transactions
  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching transactions...");
      try {
        const data = await getAllTransactions();
        setTransactions(data);
        toast.success("Transactions loaded", { id: toastId });
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

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <p className="text-gray-500">Manage all your records</p>
        </div>
        <button
          onClick={() => navigate("/add-transaction")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* ✅ Search & Filters */}
      <div className="bg-white p-4 shadow rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-full">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by description or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-700 w-full"
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

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-700 w-full"
        >
          <option>All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* ✅ Transactions Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Description</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((tx) => {
                const isIncome = tx.type === TransactionType.Income;
                const sign = isIncome ? "+" : "-";
                const color = isIncome ? "text-green-600" : "text-gray-800";

                return (
                  <tr key={tx.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">

                      {new Date(tx.transactionDate).toLocaleDateString()}

                    </td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3">
                      {tx.category?.categoryName || "—"}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${color}`}>
                      {sign}₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(tx.id)}
                        className="text-gray-600 hover:text-green-600"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-black-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
