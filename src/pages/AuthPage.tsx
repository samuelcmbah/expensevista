import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import extractErrors from "../utilities/extractErrors";
import useLoadingButton from "../hooks/useLoadingButton";
import LoadingButton from "../components/ui/LoadingButton";

export default function AuthPage() {
  const { login } = useAuth();
  const { loading, withLoading } = useLoadingButton();

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
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
    setErrorMessages([]);
  };


  // HANDLE REGISTRATION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); //stop page refresh
    setErrorMessages([]);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessages(["Please fill in all required fields."]);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessages(["Passwords do not match."]);
      return;
    }

    //controls loading state when async call is made
    await withLoading(async () => {
      try {
        await registerUser({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });
        // if successful, verify email page
        resetForm();
        navigate(`/verify-email-sent?email=${email}`);

        toast.success("Registration successful! Check your email for a verification link.");
      } catch (error) {
        let messages = ["Registration failed, try again later"];

        if (axios.isAxiosError(error)) {
          messages = extractErrors(error);
        }
        setErrorMessages(messages);
      }

    });
  };


  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); //stop page refresh
    setErrorMessages([]);

    if (!email.trim() || !password) return setErrorMessages(["Please provide email and password."]);

        //controls loading state when async call is made
    await withLoading(async () => {
    try {
      const data = await loginUser({ email, password });
      // assume backend returns: { token: 'jwt', user: { ... } }
      const token = data?.token ?? data?.accessToken ?? null;
      const user = data?.user ?? data?.applicationUser ?? null;

      if (!token) {
        throw new Error("No token received from server.");
      }

      // store token and user in auth context
      login(token, user, rememberMe);

      // redirect to welcome page or dashboard
      navigate("/welcome");
    } catch (error) {
      let messages = ["Login failed, try again later"];

      if (axios.isAxiosError(error)) {
        messages = extractErrors(error);
      }

      setErrorMessages(messages);
    } 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex w-1/2 bg-green-100 items-center justify-center">
        <div className="text-center p-10">
          <h2 className="text-3xl font-bold text-green-700 mb-4">ExpenseVista</h2>
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

          {errorMessages.length > 0 && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded ">
              {errorMessages.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
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
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                  placeholder="••••••••"
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
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
                <a className="text-green-600 hover:underline" href="#">
                  Forgot password?
                </a>
              </div>

              <LoadingButton
                type="submit"
                loading={loading}
                label="Login"
                loadingLabel="Logging in..."
              />

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
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
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
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
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
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="text"
                  placeholder="At least 8 characters"
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="text"
                  placeholder="Retype password"
                  className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
                    ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

                <LoadingButton
                  type="submit"
                  loading={loading}
                  label="Sign Up"
                  loadingLabel="Creating account..."
                />
            </form>
          )}

          <div className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => {
                    if(loading) return; // prevent switching during loading
                    setIsLogin(false);
                    setErrorMessages([]);
                    resetForm();
                    navigate("/register");
                  }}
                  className="text-green-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    if(loading) return; // prevent switching during loading
                    setIsLogin(true);
                    setErrorMessages([]);
                    resetForm();
                    navigate("/login");
                  }}
                  className="text-green-600 font-medium"
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
