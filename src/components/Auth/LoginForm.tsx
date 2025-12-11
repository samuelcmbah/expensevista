
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import extractErrors from "../../utilities/extractErrors";
import LoadingButton from "../ui/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginSchemaType, loginSchema } from "../../schemas/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

// Assuming AuthFormProps for shared props like setting errors/switching modes
interface LoginFormProps {
  setErrorMessages: (messages: string[]) => void;
  loading: boolean;
  setShowVerificationPrompt: (val: boolean) => void;
    showVerificationPrompt: boolean; 

  onResendVerification?: (email: string) => void;
  withLoading: <T>(callback: () => Promise<T>) => Promise<T | void>;
}

export default function LoginForm(props: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);



  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  // HANDLE LOGIN
  const onSubmit = async (values: LoginSchemaType) => {
    props.setErrorMessages([]);

    await props.withLoading(async () => {
      try {
        const data = await loginUser(values);
        const accessToken =
          data?.token.accessToken ||
          null;

        const user =
          data?.user ||
          data?.applicationUser ||
          null;

        if (!accessToken || !user) throw new Error("No token received.");

        login(accessToken, user, values.rememberMe);

        navigate("/welcome");
      } catch (error) {
        let messages = ["Login failed, try again later"];

        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data?.message;

          if (backendMessage === "EMAIL_NOT_CONFIRMED") {
            props.setErrorMessages(["Your email is not verified."]);
            props.setShowVerificationPrompt(true);
            return;
          }

          messages = extractErrors(error);
        }

        props.setErrorMessages(messages);
      }

    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
            ${props.loading ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        {/* Resend verification button */}
        {props.onResendVerification && props.showVerificationPrompt && (
          <button
            type="button"
            onClick={() => props.onResendVerification?.(getValues("email"))}
            className="mt-2 text-green-700 font-medium hover:underline text-sm"
          >
            Resend verification email
          </button>
        )}

      </div>

      {/* PASSWORD */}
      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>

        {/* input wrapper is relative and only wraps the input */}
        <div className="relative mt-1">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full border border-gray-300 outline-none rounded-lg px-4 py-2 pr-10 
              focus:ring-2 focus:ring-green-500
              ${props.loading ? "bg-gray-100 cursor-not-allowed" : ""}
              `}
            aria-invalid={!!errors.password}
          />

          {/* centered icon using inset-y-0 + flex */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-600 text-sm mt-2">{errors.password.message}</p>
        )}
      </div>


      {/* REMEMBER ME */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            {...register("rememberMe")}
            type="checkbox"
            className="h-4 w-4"
          />
          Remember me
        </label>
        <Link
          to="/forgot-password"
          className="text-green-600 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <LoadingButton
        type="submit"
        loading={props.loading}
        label="Login"
        loadingLabel="Logging in..."
      />
    </form>
  );
}