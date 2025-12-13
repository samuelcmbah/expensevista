import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, setUserStorage, clearUserStorage } from "../services/handleJWT";
import toast from "react-hot-toast";
import { setAccessToken } from "../utilities/tokenMemory";
import { privateApiClient, publicApiClient } from "../services/apiClient";
import type { User } from "../types/auth/user";
import { registerLogout } from "../utilities/authEvents";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // On mount: attempt refresh using HttpOnly cookie ONLY if user exists in storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUser();

      //If no user is stored, they are not logged in.
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const refreshRes = await publicApiClient.post("/auth/refresh");
        const newAccessToken = refreshRes.data.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          setUser(storedUser); 
        } else {
          throw new Error("No access token returned");
        }
      } catch (error) {
        console.error("Refresh failed:", error);
        // Use a simplified logout to avoid API calls that might also fail
        setAccessToken(null);
        clearUserStorage();
        setUser(null);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  //login: store acesstoken in memory and user in localstorage  and updates user state
  const login = (accessToken: string, user: User, remember = false) => {
    setAccessToken(accessToken);
    setUser(user);
    setUserStorage(user, remember);
  };

  //clear everything and redirect
  const logout = async () => {
    try {
      toast.loading("Logging out...", { id: "logout" });
      //revoke refresh token server-side
      await privateApiClient.post("/auth/logout");
    } catch (err) {
      // ignore network errors on logout
      console.error("Logout failed:", err);
    }

    setAccessToken(null);
    clearUserStorage();
    setUser(null);
    toast.success("You’ve been logged out", { id: "logout" });
    navigate("/login");
  };

  useEffect(() => {
    registerLogout(logout);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
