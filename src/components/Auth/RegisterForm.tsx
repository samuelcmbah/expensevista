

import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import extractErrors from "../../utilities/extractErrors";
import LoadingButton from "../ui/LoadingButton";
import { registerSchema, type RegisterSchemaType } from "../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  setErrorMessages: (messages: string[]) => void;
  loading: boolean;
  withLoading: <T>(callback: () => Promise<T>) => Promise<T | void>;
}

export default function RegisterForm({ setErrorMessages, loading, withLoading }: RegisterFormProps) {
  // form state with react hook form

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });



  // HANDLE REGISTRATION
  const onSubmit = async (values: RegisterSchemaType) => {
    setErrorMessages([]);

    await withLoading(async () => {
      try {
        await registerUser(values);

        reset();
        navigate(`/verify-email-sent?email=${values.email}`);

        toast.success("Registration successful! Check your email.");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        {/* FIRST NAME */}
        <label className="block text-sm font-medium text-gray-700">First name</label>
        <input
          {...register("firstName")}
          placeholder="John"
          className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
            ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      {/* LAST NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <input
          {...register("lastName")}
          placeholder="Doe"
          className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
            ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="johndoe@example.com"
          className={`mt-1 w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500
            ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email?.message}</p>
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
        ${loading ? "bg-gray-100 cursor-not-allowed" : ""}
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



      <LoadingButton
        type="submit"
        loading={loading}
        label="Sign Up"
        loadingLabel="Creating account..."
      />
    </form>
  );
}