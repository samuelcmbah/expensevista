import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from "lucide-react";

// 🧩 Simulated data for now (replace later with API data)
const mockData = {
  user: "Samuel Johnson",
  balance: 2318000,
  income: 2770000,
  expenses: 452000,
  budgetLimit: 300000,
  transactions: [
    { id: 1, title: "Monthly Salary", category: "Job", amount: 650000, type: "income", date: "2025-10-20" },
    { id: 2, title: "Grocery Shopping", category: "Food", amount: 25000, type: "expense", date: "2025-10-18" },
    { id: 3, title: "House Rent", category: "Rent", amount: 120000, type: "expense", date: "2025-10-15" },
    { id: 4, title: "Uber Rides", category: "Transport", amount: 15000, type: "expense", date: "2025-10-12" },
    { id: 5, title: "Electricity Bill", category: "Utilities", amount: 18000, type: "expense", date: "2025-10-10" },
  ],
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    setCurrentDate(`${month} ${year}`);
  }, []);

  const budgetStatus = ((mockData.expenses / mockData.budgetLimit) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* 🧩 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-serif font-semibold text-gray-800">
          Good afternoon, {mockData.user.split(" ")[0]} 👋
        </h1>
        <p className="text-green-700 font-medium text-base mt-2 md:mt-0">{currentDate}</p>
      </div>



      {/* 🧩 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 💰 Total Balance */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Total Balance</p>
            <h2 className="text-2xl font-semibold text-green-700">
              ₦{mockData.balance.toLocaleString()}
            </h2>
          </div>
          <Wallet className="text-green-500" size={30} />
        </div>

        {/* 💸 Total Income */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Total Income</p>
            <h2 className="text-2xl font-semibold text-blue-700">
              ₦{mockData.income.toLocaleString()}
            </h2>
          </div>
          <ArrowUpCircle className="text-blue-500" size={30} />
        </div>

        {/* 📉 Total Expenses */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <h2 className="text-2xl font-semibold text-red-700">
              ₦{mockData.expenses.toLocaleString()}
            </h2>
          </div>
          <ArrowDownCircle className="text-red-500" size={30} />
        </div>

        {/* 📊 Budget Status */}
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">Budget Status</p>
            <h2 className="text-2xl font-semibold text-purple-700">
              {budgetStatus}%
            </h2>
            <p className="text-sm text-gray-500">
              of ₦{mockData.budgetLimit.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="text-purple-500" size={30} />
        </div>
      </div>

      {/* 🧾 RECENT TRANSACTIONS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="text-green-600 text-sm font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="divide-y">
          {mockData.transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                {/* 🧩 Icon circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${t.type === "income" ? "bg-blue-100" : "bg-red-100"
                    }`}
                >
                  {t.type === "income" ? (
                    <ArrowUpCircle
                      className="text-blue-500"
                      size={20}
                    />
                  ) : (
                    <ArrowDownCircle
                      className="text-red-500"
                      size={20}
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-500">{t.category}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-medium ${t.type === "income" ? "text-blue-600" : "text-red-600"
                    }`}
                >
                  {t.type === "income" ? "+" : "-"}₦
                  {t.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
