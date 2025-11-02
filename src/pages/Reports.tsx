import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type PieLabelRenderProps,
} from "recharts";
import type { FinancialData } from "../types/analytics";
import { getAnalyticsReport } from "../services/reportsAnalyticsServices";
import { motion } from "framer-motion";

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const ReportsAnalytics: React.FC = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<FinancialData["timePeriod"]>("This Month");

  const fetchData = useCallback(async (period: FinancialData["timePeriod"]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnalyticsReport(period);
      setData(result);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again later.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod, fetchData]);

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading reports and analytics...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error loading data: {error}</div>;
  if (!data)
    return <div className="p-6 text-center text-red-600">No data available</div>;

  return (
    <motion.div
      className="p-4 sm:p-5 md:p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm mb-4">Visualize your financial trends and insights</p>
        </motion.div>

        {/* Period Selector Card */}
        <motion.div
          className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-gray-700 font-medium mb-2 sm:mb-0">Select Time Period:</p>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as FinancialData["timePeriod"])}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="This Month">This Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="This Year">This Year</option>
          </select>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Budget Progress */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Budget Progress</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">
              ₦{data.budgetProgress.spent.toLocaleString()}
              <span className="text-gray-500 text-base font-medium ml-2">
                of ₦{data.budgetProgress.total.toLocaleString()}
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative mt-3">
              <div
                className="h-2.5 rounded-full bg-green-500 transition-all duration-700 ease-in-out"
                style={{ width: `${data.budgetProgress.percentage}%` }}
              />
              <span className="absolute top-0 right-0 -mt-5 text-sm font-medium text-gray-700">
                {data.budgetProgress.percentage}%
              </span>
            </div>
          </motion.div>

          {/* Spending by Category (Pie) */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Spending by Category
            </h3>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.spendingByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    label={({ percent }: PieLabelRenderProps) =>
                      `${(Number(percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {data.spendingByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Income vs Expenses */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Income vs Expenses 💰
            </h3>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.incomeVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#4CAF50" name="Income" />
                  <Bar dataKey="expenses" fill="#F44336" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition-transform duration-300 hover:scale-[1.01]"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-600">
                <p className="text-sm font-medium text-gray-600">
                  Top spending category this period:
                </p>
                <p className="text-lg font-bold text-yellow-800">
                  {data.keyInsights.topSpendingCategory}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  ₦{data.keyInsights.topSpendingAmount.toLocaleString()} spent
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-600">
                <p className="text-sm font-medium text-gray-600">
                  Total transactions this period:
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {data.keyInsights.totalTransactions}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  <span className="font-semibold text-green-600">
                    {data.keyInsights.totalIncomeTransactions} income
                  </span>{" "}
                  |{" "}
                  <span className="font-semibold text-red-600">
                    {data.keyInsights.totalExpenseTransactions} expenses
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Financial Trend */}
          <motion.div
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 lg:col-span-2 transition-transform duration-300 hover:scale-[1.005]"
            whileHover={{ scale: 1.005 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Financial Trend
            </h3>
            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.financialTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#F44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
