import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { toast } from "react-hot-toast";
import { handleAxiosError } from "../../utilities/handleAxiosError";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });


type FormData = z.infer<typeof schema>;


export default function ResetPassword() {
  //get token and email from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

// REACT HOOK FORM SETUP
  const { register, handleSubmit, formState} = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });
  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();


  async function onSubmit(values: FormData) {
    if (!token || !email) {
      toast.error("Missing token or email. Use the link from your email.");
      return;
    }

    try {
      await resetPassword({ email, token, newPassword: values.newPassword });
      toast.success("Password reset successfully. You can now log in.");
      navigate("/login");
    } catch (err) {
      handleAxiosError("Invalid or expired token.", "reset-password-error" );
    }
  }


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Reset password</h2>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input
            {...register("newPassword")}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring"
            placeholder="New password"
            type="password"
          />
          {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input
            {...register("confirmPassword")}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring"
            placeholder="Confirm password"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  );
}