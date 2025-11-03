import React, { useEffect, useState } from "react";
import { getPaginatedTransactions } from "../services/transactionService";
import type { BudgetDTO } from "../types/Budget/BudgetDTO";
import type { TransactionDTO } from "../types/transaction/TransactionDTO";
import { TransactionType } from "../types/transaction/TransactionType";
import { getBudgetStatus } from "../services/budgetServices";
import { useAuth } from "../context/AuthContext";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [budget, setBudget] = useState<BudgetDTO | null>(null);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch dashboard data when component mounts
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [budgetResult, transactionResult] = await Promise.allSettled([
        getBudgetStatus(),
        getPaginatedTransactions({page:1, recordsPerPage:3}),
      ]);

      // ✅ Handle Budget Result
      if (budgetResult.status === "fulfilled") {
        setBudget(budgetResult.value);
      } else {
        const error = budgetResult.reason;
        if (error.response?.status === 404) {
          // show toast here
          toast.error("You have not set a budget for this month yet.");
        } else {
          console.warn("⚠️ Budget fetch failed:", error);
        }
      }

      // ✅ Handle Transaction Result
      if (transactionResult.status === "fulfilled") {
        console.log(transactionResult.value);
        setTransactions(transactionResult.value.data);
      } else {
        console.warn("⚠️ Transactions fetch failed:", transactionResult.reason);
      }

    } catch (error) {
      console.error("❌ Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // ✅ Format amount helper
  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(2) + "B";
    return amount.toLocaleString();
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ✅ Greeting and Month */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">
          {getGreeting()}, {user?.firstName || "User"} 👋
        </h2>
        <p className="text-gray-500">
          Your financial overview for{" "}
          {budget?.budgetMonth
            ? new Date(budget.budgetMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
            : "Loading..."}
        </p>
      </motion.div>

      {/* ✅ Budget Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Total Balance */}
        <motion.div
          className="bg-blue-50 shadow-sm rounded-xl p-4 flex items-center justify-between border border-blue-100"
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Budget Balance</h3>
            <p className="text-xl font-semibold text-black-500">
              ₦{budget?.remainingAmount?.toLocaleString() ?? '0'}
            </p>
          </div>
          <Wallet className="text-blue-500 w-8 h-8" />
        </motion.div>

        {/* Total Income */}
        <motion.div
          className="bg-green-50 shadow-sm rounded-xl p-4 flex items-center justify-between border border-green-100"
          whileHover={{ scale: 1.03 }}
        >
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Total Income</h3>
            <p className="text-xl font-semibold text-black-500">
              ₦{budget?.totalIncome?.toLocaleString() ?? '0'}
            </p>
          </div>
          <ArrowUpCircle className="text-green-500 w-8 h-8" />
        </motion.div>

        {/* Total Expense */}
        <motion.div
          className="bg-red-50 shadow-sm rounded-xl p-4 flex items-center justify-between border border-red-100"
          whileHover={{ scale: 1.03 }}
        >
          <div>
            <h3 className="text-gray-600 text-sm font-medium">Total Expense</h3>
            <p className="text-xl font-semibold text-black-500">
              ₦{budget?.currentUsage?.toLocaleString() ?? '0'}
            </p>
          </div>
          <ArrowDownCircle className="text-red-500 w-8 h-8" />
        </motion.div>

        {/* Budget Used */}
        <motion.div
          className="bg-purple-50 shadow-sm rounded-xl p-4 flex items-center justify-between border border-purple-100"
          whileHover={{ scale: 1.03 }}
        >
          <div>
            <h4 className="text-gray-600 text-sm font-medium">Budget Status</h4>
            <p className="text-xl font-semibold text-gray-600">
              {budget?.percentageUsed?.toFixed(1) ?? 0}%
            </p>
            <p className="text-sm text-gray-700 mt-1 truncate">
              of ₦{budget?.monthlyLimit.toLocaleString() ?? '0'}
            </p>
          </div>
          <TrendingUp className="text-purple-500 w-8 h-8" />
        </motion.div>
      </motion.div>

      {/* ✅ Recent Transactions */}
      <motion.div
        className="bg-white shadow rounded-xl p-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button
            onClick={() => navigate("/transactions")}
            className="text-green-600 text-sm font-medium hover:underline"
          >
            View All &gt;
          </button>
        </div>

        {transactions.length > 0 ? (
          <ul className="">
            {transactions.map((tx, index) => (
              <motion.li
                key={tx.id}
                className="py-3 flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${tx.type === TransactionType.Income
                        ? "bg-green-100"
                        : "bg-red-100"
                      }`}
                  >
                    {tx.type === TransactionType.Income ? (
                      <ArrowUpCircle className="text-green-600 w-5 h-5" />
                    ) : (
                      <ArrowDownCircle className="text-red-600 w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-normal truncate max-w-[180px] sm:max-w-[250px] md:max-w-[300px]">
                      {tx.description && tx.description.length > 40
                        ? `${tx.description.slice(0, 37)}...`
                        : tx.description}

                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.transactionDate).toLocaleDateString()} •{" "}
                      {tx.category?.categoryName ?? "Uncategorized"}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-medium ${tx.type === TransactionType.Income
                      ? "text-gray-600"
                      : "text-gray-600"
                    }`}
                >
                  {tx.type === TransactionType.Income ? "+" : "-"}₦
                  {formatAmount(tx.amount)}
                </p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent transactions yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
