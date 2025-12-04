
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
    
  }, [location.pathname]);


  // Handler to switch modes
  const handleModeSwitch = useCallback((mode: 'login' | 'register') => {
    if (loading) return; // prevent switching during loading
    
    setIsLogin(mode === 'login');
    setErrorMessages([]);     // Clear errors when URL changes
    setShowVerificationPrompt(false);
    navigate(mode === 'login' ? "/login" : "/register");
    
    // Note: Form fields state is  managed inside LoginForm/RegisterForm
    // and is naturally reset when they unmount/remount on mode switch.
  }, [loading, navigate]);
  
  // Handler to resend verification email
  const handleResendVerification = async (email: string) => {
  try {
    await resendEmailVerification(email); 
    toast.success("Verification email sent."); 
    setErrorMessages(["Click the link in your email to verify your account."]);
     setShowVerificationPrompt(false);
  } catch {
    setErrorMessages(["Failed to resend verification email"]);
  }
}


return (
  <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    {/* Left Panel - Brand Side */}
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center p-12 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl text-white mb-4">ExpenseVista</h2>
        <p className="text-emerald-50 text-lg leading-relaxed">
          "Take control of your money, one expense at a time."
        </p>
        <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">✓</div>
            <div>Track Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✓</div>
            <div>Set Budgets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">✓</div>
            <div>Save Money</div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Panel - Form Side */}
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-3xl ">
          {/* Auth Logo + Title */}
          <div className="flex flex-col items-center mb-4">
            {isLogin ? (
              <>
                {/* Compact Icon for Login */}
                <div className="mb-4">
                  <img
                    src="/favicon.png"
                    alt="ExpenseVista Icon"
                    className="h-12 w-auto"
                  />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">
                  Welcome Back!
                </h2>
              </>
            ) : (
              <>
                {/* Full Logo for Register */}
                <div className="mb-4">
                  <img
                    src="/ExpenseVista-official-logo.png"
                    alt="ExpenseVista Logo"
                    className="h-12 w-auto"
                  />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">
                  Create an Account
                </h2>
              </>
            )}
          </div>

          {/* Server error messages */}
          {errorMessages.length > 0 && (
            <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl">
              {errorMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}

          {/* Social Login Buttons - Uncomment when ready to implement */}
          
            {/* <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700">Continue with Google</span>
            </button>
            

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div> */}
         

          {/* Conditional Rendering of Forms */}
          {isLogin ? (
            <LoginForm
              setErrorMessages={setErrorMessages}
              loading={loading}
              setShowVerificationPrompt={setShowVerificationPrompt}
              showVerificationPrompt={showVerificationPrompt}
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
          <div className="text-center mt-4 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => handleModeSwitch('register')}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => handleModeSwitch('login')}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
        
        {/* Mobile Logo */}
        <div className="md:hidden text-center mt-6">
          <p className="text-sm text-gray-500">ExpenseVista</p>
        </div>
      </div>
    </div>
  </div>
);
}