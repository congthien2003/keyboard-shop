"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AdminInfo {
  id: string;
  username: string;
  name: string;
  email?: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  adminInfo: AdminInfo | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("km_admin_auth");
    const storedAdminInfo = localStorage.getItem("km_admin_info");

    if (auth === "true" && storedAdminInfo) {
      setIsAuthenticated(true);
      setAdminInfo(JSON.parse(storedAdminInfo));
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("km_admin_auth", "true");
        localStorage.setItem("km_admin_info", JSON.stringify(data.admin));
        setIsAuthenticated(true);
        setAdminInfo(data.admin);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Đã xảy ra lỗi khi đăng nhập" };
    }
  };

  const logout = () => {
    localStorage.removeItem("km_admin_auth");
    localStorage.removeItem("km_admin_info");
    setIsAuthenticated(false);
    setAdminInfo(null);
    router.push("/admin/login");
  };

  return (
    <AdminContext.Provider
      value={{ isAuthenticated, adminInfo, login, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
