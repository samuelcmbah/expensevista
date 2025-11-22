import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmEmail } from "../services/authService";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const token = params.get("token");

    if (!email || !token) {
      setMessage("Invalid verification link.");
      return;
    }

    async function verify() {
      try {
        await confirmEmail(email!, token!);
        setMessage("Email verified successfully!");
        toast.success("Email verified. You can now login.");
        setTimeout(() => navigate("/login"), 1500);
      } catch {
        setMessage("Verification failed. The link may be expired.");
      }
    }

    verify();
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
      </div>
    </div>
  );
}
