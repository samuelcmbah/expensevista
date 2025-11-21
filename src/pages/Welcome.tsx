import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Create Budget",
      description: "Set your monthly spending limit",
      action: () => navigate("/settings"),
      icon: "💰",
    },
    
    {
      title: "Add Transactions",
      description: "Track your expenses and income",
      action: () => navigate("/transactions"),
      icon: "🧾",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Hi there, welcome to ExpenseVista!
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        To get started, create a budget for the month and start adding your transaction records.
      </p>

      <div className="w-full max-w-md space-y-4">
        {options.map((opt) => (
          <div
            key={opt.title}
            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:shadow transition"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{opt.icon}</div>
              <div>
                <h2 className="text-sm font-medium text-gray-800">{opt.title}</h2>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
            </div>
            <button
              onClick={opt.action}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Continue →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
