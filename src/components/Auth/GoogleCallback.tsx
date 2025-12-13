import React, { useEffect, useState, useRef } from 'react'; 
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { publicApiClient } from '../../services/apiClient';
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";

const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    
    // Create a ref to track if the effect has already run
    const effectRan = useRef(false);

    useEffect(() => {
        // Only run the logic if it's the first time in this mount cycle
        if (effectRan.current === false) {
            const handleGoogleCallback = async () => {
                const authorizationCode = searchParams.get('code');
                const googleError = searchParams.get('error');

                if (googleError) {
                    setError("Google authentication failed. Please try again.");
                    toast.error("Google authentication failed.");
                    navigate('/login');
                    return;
                }

                if (!authorizationCode) {
                    setError("Could not find authorization code. Please try again.");
                    toast.error("An unexpected error occurred.");
                    navigate('/login');
                    return;
                }

                try {
                    const response = await publicApiClient.post('/auth/google-login', {
                        authorizationCode: authorizationCode,
                    });

                    const { token, user } = response.data;
                    login(token.accessToken, user);
                    toast.success("Successfully logged in!");
                    navigate('/welcome');

                } catch (err: any) {
                    setError("Failed to log in with Google. Please try again.");
                    toast.error(err.response?.data?.message || "Login failed.");
                    navigate('/login');
                }
            };

            handleGoogleCallback();
        }

        // 4. Cleanup function to set the ref on unmount
        return () => {
            effectRan.current = true;
        }
    }, [searchParams, login, navigate]); 

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center py-24 text-gray-500 min-h-[300px]">
        <Loader2 className="animate-spin h-6 w-6 text-green-500" />
        <p className="mt-4">Authenticating...</p>
        {error && <p className="error-message text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
};

export default GoogleCallback;