import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { toast } from "react-hot-toast";


const schema = z.object({
  email: z.email("Invalid email address")
});


type FormData = z.infer<typeof schema>;


export default function ForgotPassword() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();


  async function onSubmit(values: FormData) {
    try {
      await forgotPassword(values.email);
      toast.success("If an account exists, a reset link has been sent to that email.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  }


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Forgot password</h2>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring"
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>


        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </form>
    </div>
  );
}