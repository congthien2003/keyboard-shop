import type React from "react";
import type { Metadata } from "next";
import { AdminProvider } from "@/contexts/admin-context";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Admin - FreshFruit",
  description: "Admin Dashboard - FreshFruit Fruit Store",
  icons: {
    icon: "/images/logo-khangmy.webp",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <I18nProvider>
      <AdminProvider>{children}</AdminProvider>
    </I18nProvider>
  );
}
