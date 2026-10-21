"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAdmin } from "@/contexts/admin-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  ShoppingCart,
  MessageSquare,
  FolderTree,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import Image from "next/image";

export function AdminSidebar() {
  const { t } = useI18n();
  const { logout } = useAdmin();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      key: "products",
      href: "/admin/products",
      icon: Package,
    },
    { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      key: "categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      key: "news",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      key: "orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      key: "contacts",
      href: "/admin/contacts",
      icon: MessageSquare,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border bg-primary/5">
        <div className="flex items-center gap-3">
          <Image
            src="/images/mechkey/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <h2 className="font-bold text-lg text-primary">SB-MechKey</h2>
            <p className="text-xs text-muted-foreground">
              {t("admin.sidebar.adminPanel") || "Admin Panel"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">
                {t(`admin.sidebar.${item.key}`) || item.key}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2 flex flex-col items-center">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="w-full flex justify-center"
        >
          <Button variant="outline" className="w-3/4 justify-center gap-3">
            <Home className="h-5 w-5" />
            {t("admin.sidebar.backToSite") || "Về trang chủ"}
          </Button>
        </Link>
        <Button
          variant="destructive"
          className="w-3/4 justify-center gap-3"
          onClick={() => {
            logout();
            setMobileOpen(false);
          }}
        >
          <LogOut className="h-5 w-5" />
          {t("admin.sidebar.logout") || "Đăng xuất"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/mechkey/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2 className="font-bold text-primary">Admin</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col animate-in slide-in-from-left-2 duration-300">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
