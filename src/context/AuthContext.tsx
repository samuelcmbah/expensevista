import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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

  // Load token/user on app start
  useEffect(() => {
  const savedToken =
    localStorage.getItem("expensevista_token") ??
    sessionStorage.getItem("expensevista_token");
  const savedUser =
    localStorage.getItem("expensevista_user") ??
    sessionStorage.getItem("expensevista_user");

  if (savedToken) setToken(savedToken);

  if (savedUser) {
    try {
      setUser(JSON.parse(savedUser));
    } catch {
      console.warn("Failed to parse saved user, clearing corrupted data.");
      localStorage.removeItem("expensevista_user");
      sessionStorage.removeItem("expensevista_user");
    }
  }

  setLoading(false);
}, []);


  // Attach token to all axios requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  const login = (token: string, user: User, remember = false) => {
    setToken(token);
    setUser(user);
    if (remember) {
      localStorage.setItem("expensevista_token", token);
      localStorage.setItem("expensevista_user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("expensevista_token", token);
      sessionStorage.setItem("expensevista_user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
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
