import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();


  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
  if (location.pathname === "/login") {
    setIsLogin(true);
  } else if (location.pathname === "/register") {
    setIsLogin(false);
  }
}, [location.pathname]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };


  // HANDLE REGISTRATION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); //stop page refresh
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      // if successful, switch to login mode and show success message
      resetForm();
      setIsLogin(true);
      setError("Registration successful. Please login."); // small UX choice
    } catch (err: any) {
      // attempt to extract a useful message
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors ??
        err?.message ??
        "Registration failed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };


  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //stop page refresh
    setError(null);

    if (!email.trim() || !password) return setError("Please provide email and password.");


    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      // assume backend returns: { token: 'jwt', user: { ... } }
      const token = data?.token ?? data?.accessToken ?? null;
      const user = data?.user ?? data?.applicationUser ?? null;

      console.log("Login response data:", data);
      if (!token) {
        throw new Error("No token received from server.");
      }

      // store token and user in auth context
      login(token, user, rememberMe);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Login failed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
        <div className="text-center p-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">ExpenseVista</h2>
          <p className="text-gray-600 italic">
            “Take control of your money, one expense at a time.”
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {isLogin ? "Login to ExpenseVista" : "Create an Account"}
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="samuelcmbah@gmail.com"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Remember me
                </label>
                <a className="text-blue-600 hover:underline" href="#">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="Samuel"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Mbah"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="samuelcmbah@gmail.com"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="At least 8 characters"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Retype password"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
          )}

          <div className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError(null);
                    resetForm();
                    navigate("/register");
                  }}
                  className="text-blue-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError(null);
                    resetForm();
                    navigate("/login");
                  }}
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
