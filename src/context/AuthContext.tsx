import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, setTokenStorage, setUserStorage, clearTokenStorage, clearUserStorage } from "../services/handleJWT";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load token/user on app start
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(savedUser);

    setLoading(false);
  }, []);

  // ✅ login: store token/user and update state
  const login = (token: string, user: User, remember = false) => {
    setToken(token);
    setUser(user);
    setTokenStorage(token, remember);
    setUserStorage(user, remember);
  };

  // ✅ logout: clear everything and redirect
  const logout = () => {
    setToken(null);
    setUser(null);
    clearTokenStorage();
    clearUserStorage();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, loading, login, logout }}
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
