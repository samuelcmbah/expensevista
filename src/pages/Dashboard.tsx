import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../services/transactionService";
import type { BudgetDTO } from "../types/BudgetDTO";
import type { TransactionDTO } from "../types/TransactionDTO";
import { TransactionType } from "../types/TransactionType";
import { getBudgetStatus } from "../services/budgetServices";
import { useAuth } from "../context/AuthContext";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        const [budgetData, transactionData] = await Promise.all([
          getBudgetStatus(),
          getAllTransactions(),
        ]);
        setBudget(budgetData);
        setTransactions(transactionData.slice(0, 5)); // Show only the 5 most recent transactions
      } catch (error) {
        console.error("❌ Failed to load dashboard data:", error);
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

  return (
    <div className="space-y-6">
      {/* ✅ Greeting and Month */}
      <div>
        <h2 className="text-2xl font-semibold">
          {getGreeting()}, {user?.firstName || "User"} 👋
        </h2>
        <p className="text-gray-500">
          Your financial overview for {budget?.budgetMonth
            ? new Date(budget.budgetMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
            : "Loading..."}
        </p>
      </div>

      {/* ✅ Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm">Balance</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₦{budget?.remainingAmount?.toLocaleString() ?? "0"}
            </p>
          </div>
          <Wallet className="text-blue-600 w-8 h-8" />
        </div>

        {/* Total Income */}
        <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              ₦{budget?.totalIncome?.toLocaleString() ?? "0"}
            </p>
          </div>
          <ArrowUpCircle className="text-green-600 w-8 h-8" />
        </div>

        {/* Total Expense */}
        <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm">Total Expense</h3>
            <p className="text-2xl font-bold text-red-600">
              ₦{budget?.currentUsage?.toLocaleString() ?? "0"}
            </p>
          </div>
          <ArrowDownCircle className="text-red-600 w-8 h-8" />
        </div>

        {/* Budget Used */}
        <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm">Budget Status</h3>
            <p className="text-2xl font-bold text-purple-600">
              {budget?.percentageUsed?.toFixed(1) ?? 0}%
            </p>
            <p className="text-sm text-gray-800 mt-1 truncate">of ₦{budget?.monthlyLimit.toLocaleString() ?? "0"}</p>

          </div>
          <TrendingUp className="text-purple-600 w-8 h-8" />
        </div>
      </div>

      {/* ✅ Recent Transactions */}
      <div className="bg-white shadow rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button 
            onClick={() => navigate("/transactions")}
            className="text-blue-600 text-sm font-medium hover:underline">
            View All
          </button>
        </div>

        {transactions.length > 0 ? (
          <ul className="divide-y">
            {transactions.map((tx) => (
              <li key={tx.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
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
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.transactionDate).toLocaleDateString()} •{" "}
                      {tx.category?.categoryName ?? "Uncategorized"}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${tx.type === TransactionType.Income
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {tx.type === TransactionType.Income ? "+" : "-"}₦
                  {tx.amount.toLocaleString()}
                </p>
              </li>

            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recent transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
