import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side (optional illustration) */}
      <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
        <div className="text-center p-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">ExpenseVista</h2>
          <p className="text-gray-600 italic">
            “Take control of your money, one expense at a time.”
          </p>
        </div>
      </div>

      {/* Right side (form) */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {isLogin ? "Login to ExpenseVista" : "Create an Account"}
          </h2>

          <form className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-medium"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
