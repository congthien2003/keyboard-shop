"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import Image from "next/image";
import { LanguageSwitcherAdmin } from "@/components/common/language-switcher-admin";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || "Đăng nhập thất bại");
        setPassword("");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcherAdmin />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <Image
              src="/images/logo-khangmy.webp"
              alt="FreshFruit Logo"
              width={100}
              height={100}
              className="rounded-full shadow-lg"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            {t("admin.login.title") || "Admin Dashboard"}
          </CardTitle>
          <p className="text-muted-foreground">
            {t("admin.login.subtitle") || "Đăng nhập để quản lý hệ thống"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                {t("admin.login.username") || "Tên đăng nhập"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    t("admin.login.usernamePlaceholder") || "Nhập tên đăng nhập"
                  }
                  className="pl-10 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("admin.login.password") || "Mật khẩu"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    t("admin.login.passwordPlaceholder") || "Nhập mật khẩu"
                  }
                  className="pl-10 pr-10 h-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              size="lg"
              disabled={isLoading}
            >
              {isLoading
                ? "Đang đăng nhập..."
                : t("admin.login.submit") || "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {t("admin.login.footer") ||
                "© 2025 FreshFruit - Trái Cây Tươi Ngon"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
