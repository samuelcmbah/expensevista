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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import StickyPageLayout from "../components/layouts/StickyPageLayout";

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




  // ✅ Convert numeric strings to numbers before charts
  const spendingByCategory = data?.spendingByCategory?.map((item) => ({
    ...item,
    value: parseFloat(item.value),
  })) ?? [];

  const incomeVsExpenses = data?.incomeVsExpenses?.map((item) => ({
    ...item,
    income: parseFloat(item.income),
    expenses: parseFloat(item.expenses),
  })) ?? [];

  const financialTrend = data?.financialTrend?.map((item) => ({
    ...item,
    income: parseFloat(item.income),
    expenses: parseFloat(item.expenses),
  })) ?? [];

  const budgetProgress = data?.budgetProgress
    ? {
      spent: parseFloat(data.budgetProgress.spent),
      total: parseFloat(data.budgetProgress.total),
      percentage: parseFloat(data.budgetProgress.percentage),
    }
    : { spent: 0, total: 0, percentage: 0 };

  const keyInsights = data?.keyInsights
    ? {
      ...data.keyInsights,
      topSpendingAmount: parseFloat(data.keyInsights.topSpendingAmount),
    }
    : {
      topSpendingCategory: "N/A",
      topSpendingAmount: 0,
      totalTransactions: "0",
      totalIncomeTransactions: "0",
      totalExpenseTransactions: "0",
    };

  const isEmptyFinancialData = (data: FinancialData): boolean => {
  if (!data) return true;

  const hasSummary =
    data.summary &&
    (parseFloat(data.summary.totalIncome) > 0 ||
      parseFloat(data.summary.totalExpenses) > 0 ||
      parseFloat(data.summary.netBalance) !== 0);

  const hasCharts =
    (data.spendingByCategory && data.spendingByCategory.length > 0) ||
    (data.incomeVsExpenses && data.incomeVsExpenses.length > 0) ||
    (data.financialTrend && data.financialTrend.length > 0);

  return !hasSummary && !hasCharts;
};



  const header = (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h2>
        <p className="text-gray-500 text-sm mb-4">
          Visualize your financial trends and insights
        </p>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-gray-700 font-medium mb-2 sm:mb-0">Select Time Period:</p>
        <Select
          value={selectedPeriod}
          onValueChange={(value) =>
            setSelectedPeriod(value as FinancialData["timePeriod"])
          }
        >
          <SelectTrigger className="w-[180px] border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-green-200 focus:border-green-200 text-sm sm:text-base">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </>
  )

  return (
    <StickyPageLayout header={header} scrollable={true}>
      <motion.div
        className="flex items-center justify-center min-h-[70vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {loading && (
          <p className="text-gray-600 text-base">Loading reports and analytics...</p>
        )}

        {!loading && error && (
          <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow-sm border border-red-100 max-w-md">
            <p className="font-medium mb-1">Network error loading data</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (!data || isEmptyFinancialData(data)) && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mb-4 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">No financial reports available yet</p>
            <p className="text-sm mt-1">
              Start adding your income and expenses to see your analytics here.
            </p>
          </div>
        )}



        {!loading && !error && data && !isEmptyFinancialData(data) && (

          <motion.div
            className="w-full bg-gray-50 max-w-7xl mx-auto space-y-6 "
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="max-w-7xl mx-auto space-y-6">


              {/* Top Summary Cards */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Income</p>
                  <h3 className="text-2xl font-semibold text-green-600">
                    ₦{data.summary.totalIncome.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                  <h3 className="text-2xl font-semibold text-red-500">
                    ₦{data.summary.totalExpenses.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Net Balance</p>
                  <h3 className="text-2xl font-semibold text-blue-600">
                    ₦{data.summary.netBalance.toLocaleString()}
                  </h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
                  <h3 className="text-2xl font-semibold text-purple-600">
                    {data.summary.savingsRate}%
                  </h3>
                </div>
              </motion.div>


              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
                {/* Left Column (2/3 width) */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Budget Progress & Spending by Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget Progress */}
                    <motion.div
                      className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.01 }}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                        Budget Progress
                      </h3>

                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        ₦{budgetProgress.spent.toLocaleString()}
                        <span className="text-gray-500 text-base font-medium ml-2">
                          of ₦{budgetProgress.total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2.5 relative mt-3">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${budgetProgress.spent > budgetProgress.total
                              ? "bg-red-500"
                              : "bg-green-500"
                            }`}
                          style={{
                            width: `${Math.min(budgetProgress.percentage, 100)}%`, // cap at 100%
                          }}
                        />
                        <span className="absolute top-0 right-0 -mt-5 text-sm font-medium text-gray-700">
                          {budgetProgress.percentage}%
                        </span>
                      </div>

                      {budgetProgress.spent > budgetProgress.total && (
                        <p className="mt-3 text-sm font-medium text-red-600">
                          ⚠️ You have exceeded your monthly budget.
                        </p>
                      )}
                    </motion.div>


                    {/* Spending by Category (Pie) */}
                    <motion.div
                      className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.01 }}
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                        Spending by Category
                      </h3>
                      <div className="w-full h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={spendingByCategory}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius="70%"
                              label={({ percent }: PieLabelRenderProps) =>
                                `${(Number(percent ?? 0) * 100).toFixed(0)}%`
                              }
                            >
                              {spendingByCategory.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
                            <Legend
                              verticalAlign="bottom"
                              align="center"
                              wrapperStyle={{ fontSize: "12px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  </div>

                  {/* Income vs Expenses (Full Width) */}
                  <motion.div
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                      Income vs Expenses 💰
                    </h3>
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeVsExpenses}>
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
                </div>

                {/* Right Column (Key Insights) */}
                <div className="space-y-6">
                  <motion.div
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                      Key Insights
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-600">
                        <p className="text-sm font-medium text-gray-600">
                          Top spending category this period:
                        </p>
                        <p className="text-lg font-bold text-yellow-800">
                          {keyInsights.topSpendingCategory}
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          ₦{keyInsights.topSpendingAmount.toLocaleString()} spent
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-600">
                        <p className="text-sm font-medium text-gray-600">
                          Total transactions this period:
                        </p>
                        <p className="text-lg font-bold text-blue-800">
                          {keyInsights.totalTransactions}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          <span className="font-semibold text-green-600">
                            {keyInsights.totalIncomeTransactions} income
                          </span>{" "}
                          |{" "}
                          <span className="font-semibold text-red-600">
                            {keyInsights.totalExpenseTransactions} expenses
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Financial Trend (Full width bottom section) */}
              <motion.div
                className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mt-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.005 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  Financial Trend
                </h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialTrend}>
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

          </motion.div>
        )}

      </motion.div>

    </StickyPageLayout>

  );
};
