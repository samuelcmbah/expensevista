import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { resendEmailVerification } from "../services/authService";
import toast from "react-hot-toast";
import LoadingButton from "../components/ui/LoadingButton";
import useLoadingButton from "../hooks/useLoadingButton";

export default function VerifyEmailSent() {
  const { loading, withLoading } = useLoadingButton();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setEmail(params.get("email") || "");
  }, [location.search]);

  const handleResend = async () => {
    await withLoading(async () => {
      try {
        await resendEmailVerification(email);
        toast.success("Verification email resent.");
      } catch {
        toast.error("Failed to resend verification email.");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>

        <p className="text-gray-600 mb-6">
          A verification link has been sent to <br />
          <span className="font-medium">{email}</span>
        </p>

        <LoadingButton
          onClick={handleResend}
          loading={loading}
          label="Resend Verification Email"
          loadingLabel="Sending..."
        />

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-green-600 font-medium text-sm"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
