
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import extractErrors from "../../utilities/extractErrors";
import LoadingButton from "../ui/LoadingButton";

// Assuming AuthFormProps for shared props like setting errors/switching modes
interface LoginFormProps {
  setErrorMessages: (messages: string[]) => void;
  loading: boolean;
  withLoading: <T>(callback: () => Promise<T>) => Promise<T | void>;
}

export default function LoginForm({ setErrorMessages, loading, withLoading }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    if (!email.trim() || !password) {
      return setErrorMessages(["Please provide email and password."]);
    }

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
          type="password" // Changed to password type for security
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
  );
}