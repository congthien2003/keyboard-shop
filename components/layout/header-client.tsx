"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { getCart } from "@/lib/cart";

type NavItem = {
  key: string;
  href: string;
  label: string;
};

type HeaderClientProps = {
  lang: "vi" | "en";
  navItems: NavItem[];
  brandName: string;
  cartLabel: string;
};

export function HeaderClient({
  lang,
  navItems,
  brandName,
  cartLabel,
}: {
  lang: "vi" | "en";
  navItems: NavItem[];
  brandName: string;
  cartLabel: string;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "km_cart") {
        updateCartCount();
      }
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const isActive = (href: string) => {
    const basePath = `/${lang}`;
    if (href === "/") {
      return pathname === basePath;
    }
    return pathname.startsWith(`${basePath}${href}`);
  };

  return (
    <div className="container mx-auto flex h-24 items-center justify-between px-4">
      {/* Logo */}
      <Link
        href={`/${lang}`}
        className="flex flex-col items-center rounded-xl px-2 py-1 transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
      >
        <Image
          src="/images/logo-khangmy.webp"
          alt="Logo"
          width={60}
          height={60}
        />
        <span className="text-sm font-bold">{brandName}</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={`/${lang}${item.href}`}
              className={`relative rounded-md px-1 py-2 text-base font-medium transition-colors duration-200 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/70 ${
                active
                  ? "text-primary-foreground font-semibold"
                  : "text-primary-foreground/70"
              }`}
            >
              {item.label}
              {active && (
                <div className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher lang={lang} />
        <Link href={`/${lang}/gio-hang`}>
          <Button
            variant="secondary"
            size="sm"
            className="relative hidden gap-2 border border-primary-foreground/10 bg-primary-foreground/95 shadow-sm transition-colors duration-200 hover:bg-primary-foreground md:flex"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="font-medium">{cartLabel}</span>
            {cartCount > 0 && (
              <div className="absolute -right-1.5 -top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-sm">
                {cartCount}
              </div>
            )}
          </Button>
        </Link>

        {/* Mobile cart button */}
        <Link href={`/${lang}/gio-hang`} className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="relative text-primary-foreground transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <div className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-sm">
                {cartCount}
              </div>
            )}
          </Button>
        </Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-primary-foreground/10 bg-primary/[0.98] shadow-xl backdrop-blur-md animate-in slide-in-from-top-2 duration-300 md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={`/${lang}${item.href}`}
                  className={`relative rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/70 ${
                    active
                      ? "text-primary-foreground font-semibold bg-primary-foreground/10"
                      : "text-primary-foreground/70"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  {active && (
                    <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
