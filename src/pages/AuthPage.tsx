
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLoadingButton from "../hooks/useLoadingButton";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import { resendEmailVerification } from "../services/authService";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { loading, withLoading } = useLoadingButton(); // Shared loading hook

  // State to determine which form to show
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);  
const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  
  const navigate = useNavigate();
  const location = useLocation();

  // Logic to determine initial form based on URL
  useEffect(() => {
    setIsLogin(location.pathname === "/login");//false for /register
    setErrorMessages([]);     // Clear errors when URL changes
    setShowVerificationPrompt(false);
  }, [location.pathname]);


  // Handler to switch modes
  const handleModeSwitch = useCallback((mode: 'login' | 'register') => {
    if (loading) return; // prevent switching during loading
    
    setIsLogin(mode === 'login');
    setErrorMessages([]);
    navigate(mode === 'login' ? "/login" : "/register");
    
    // Note: Form fields state is  managed inside LoginForm/RegisterForm
    // and is naturally reset when they unmount/remount on mode switch.
  }, [loading, navigate]);
  
  // Handler to resend verification email
  const handleResendVerification = async (email: string) => {
  try {
    await resendEmailVerification(email); 
    toast.success("Verification email sent."); 
    setErrorMessages(["Verification email sent!"]);
     setShowVerificationPrompt(false);
  } catch {
    setErrorMessages(["Failed to resend verification email"]);
  }
}


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

          {/*server error messages*/}
          {errorMessages.length > 0 && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded ">
              {errorMessages.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          )}

          

          {/* Conditional Rendering of Forms */}
          {isLogin ? (
            <LoginForm
              setErrorMessages={setErrorMessages}
              loading={loading}
              setShowVerificationPrompt={setShowVerificationPrompt}
                showVerificationPrompt={showVerificationPrompt} // new

              onResendVerification={handleResendVerification}
              withLoading={withLoading}
            />
          ) : (
            <RegisterForm 
              setErrorMessages={setErrorMessages} 
              loading={loading}
              withLoading={withLoading}
            />
          )}

          {/* Mode Switcher */}
          <div className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => handleModeSwitch('register')}
                  className="text-green-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleModeSwitch('login')}
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