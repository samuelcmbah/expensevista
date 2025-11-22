
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import extractErrors from "../../utilities/extractErrors";
import LoadingButton from "../ui/LoadingButton";

interface RegisterFormProps {
  setErrorMessages: (messages: string[]) => void;
  loading: boolean;
  withLoading: <T>(callback: () => Promise<T>) => Promise<T | void>;
}

export default function RegisterForm({ setErrorMessages, loading, withLoading }: RegisterFormProps) {
  const navigate = useNavigate();

  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetFormFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // HANDLE REGISTRATION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessages(["Please fill in all required fields."]);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessages(["Passwords do not match."]);
      return;
    }

    await withLoading(async () => {
      try {
        await registerUser({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });
        
        resetFormFields();
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

  return (
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
          type="password" // Changed to password type for security
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
          type="password" // Changed to password type for security
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
  );
}