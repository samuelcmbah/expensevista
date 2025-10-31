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
} from "recharts";
import type { FinancialData } from "../types/analytics";

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const ReportsAnalytics: React.FC = () => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    FinancialData["timePeriod"]
  >("This Month");

  // Mock data for preview/demo
  const fetchData = useCallback(async (period: string) => {
    setLoading(true);
    try {
      const mockData: FinancialData = {
        timePeriod: period as FinancialData["timePeriod"],
        budgetProgress: {
          spent: 58000,
          total: 100000,
          percentage: 58,
        },
        spendingByCategory: [
          { name: "Food", value: 20000, percentage: 34 },
          { name: "Transport", value: 12000, percentage: 20 },
          { name: "Utilities", value: 8000, percentage: 13 },
          { name: "Entertainment", value: 10000, percentage: 17 },
          { name: "Health", value: 8000, percentage: 13 },
        ],
        incomeVsExpenses: [
          { month: "Jun 2025", income: 120000, expenses: 80000 },
          { month: "Jul 2025", income: 130000, expenses: 95000 },
          { month: "Aug 2025", income: 125000, expenses: 88000 },
          { month: "Sep 2025", income: 140000, expenses: 97000 },
          { month: "Oct 2025", income: 135000, expenses: 92000 },
        ],
        financialTrend: [
          { month: "Jun 2025", income: 120000, expenses: 80000 },
          { month: "Jul 2025", income: 130000, expenses: 95000 },
          { month: "Aug 2025", income: 125000, expenses: 88000 },
          { month: "Sep 2025", income: 140000, expenses: 97000 },
          { month: "Oct 2025", income: 135000, expenses: 92000 },
        ],
        keyInsights: {
          topSpendingCategory: "Food",
          topSpendingAmount: 20000,
          totalTransactions: 45,
          totalIncomeTransactions: 18,
          totalExpenseTransactions: 27,
        },
      };

      // simulate small delay
      await new Promise((res) => setTimeout(res, 500));
      setData(mockData);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod, fetchData]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading reports and analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading data. Please check your API connection.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">
        Reports & Analytics 📈
      </h2>
      <p className="text-gray-500 mb-6">
        Visualize your financial trends and insights
      </p>

      {/* Time Period Selector */}
      <div className="flex justify-end mb-6">
        <label className="text-gray-600 mr-2 self-center">Show data for:</label>
        <select
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(e.target.value as FinancialData["timePeriod"])
          }
          className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="This Month">This Month</option>
          <option value="Last 3 Months">Last 3 Months</option>
          <option value="Last 6 Months">Last 6 Months</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Budget Progress
          </h3>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ₦{data.budgetProgress.spent.toLocaleString()}
            <span className="text-gray-500 text-lg font-medium ml-2">
              of ₦{data.budgetProgress.total.toLocaleString()}
            </span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 relative mt-4">
            <div
              className="h-2.5 rounded-full bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${data.budgetProgress.percentage}%` }}
            ></div>
            <span className="absolute top-0 right-0 -mt-6 text-sm font-medium text-gray-700">
              {data.budgetProgress.percentage}%
            </span>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Spending by Category 📊
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.spendingByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.spendingByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Income vs Expenses 💰
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.incomeVsExpenses}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value: number) => `₦${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" name="Income" />
              <Bar dataKey="expenses" fill="#F44336" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Key Insights ✨
          </h3>
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
        </div>

        {/* Financial Trend */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Financial Trend 📉
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.financialTrend}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value: number) => `₦${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4CAF50"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#F44336"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
