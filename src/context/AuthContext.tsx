import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


interface User{
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token/user on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("expensevista_token") ?? sessionStorage.getItem("expensevista_token");
    const savedUser = localStorage.getItem("expensevista_user") ?? sessionStorage.getItem("expensevista_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      if(savedUser){
      setUser(JSON.parse(savedUser));
    }
  }
  }, []);

  //Automatically attach token to axios requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization= `Bearer ${token}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor); // Cleanup interceptor on unmount
         
  }, [token]);

  //save token/user to storage 
  const login = (token: string, user: User, remember: boolean = false) => {
    setToken(token);
    if(user){
      setUser(user);
    }
    if(remember){
      localStorage.setItem("expensevista_token", token);
      if(user){
      localStorage.setItem("expensevista_user", JSON.stringify(user));
      }
    }else{
      sessionStorage.setItem("expensevista_token", token);
      if(user){
      sessionStorage.setItem("expensevista_user", JSON.stringify(user));
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("expensevista_token");
    localStorage.removeItem("expensevista_user");
    sessionStorage.removeItem("expensevista_token");
    sessionStorage.removeItem("expensevista_user");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Simple hook for consuming the context
export function useAuth() {
  const ctx =  useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}