"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, Search } from "lucide-react";

type NotFoundContentProps = {
  lang: "vi" | "en";
  translations: {
    message: string;
    description: string;
    goHome: string;
    goProducts: string;
    searchProducts: string;
    nav: {
      about: string;
      contact: string;
    };
  };
};

export function NotFoundContent({ lang, translations }: NotFoundContentProps) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background px-4 py-16">
      <div className="storefront-card w-full max-w-2xl space-y-8 p-8 text-center md:p-12">
        {/* 404 Heading */}
        <div className="space-y-4">
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 select-none leading-none">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {translations.message}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {translations.description}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="gap-2 shadow-[0_12px_24px_-16px_oklch(0.3_0.07_155/0.8)]"
          >
            <Link href={`/${lang}`}>
              <Home className="h-5 w-5" />
              {translations.goHome}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 border-primary/20 bg-card hover:bg-secondary hover:text-secondary-foreground"
          >
            <Link href={`/${lang}/san-pham`}>
              <ShoppingBag className="h-5 w-5" />
              {translations.goProducts}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 border-primary/20 bg-card hover:bg-secondary hover:text-secondary-foreground"
          >
            <Link href={`/${lang}/san-pham`}>
              <Search className="h-5 w-5" />
              {translations.searchProducts}
            </Link>
          </Button>
        </div>

        {/* Additional Help Text */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/${lang}`}
              className="hover:text-foreground transition-colors"
            >
              {translations.goHome}
            </Link>{" "}
            •{" "}
            <Link
              href={`/${lang}/san-pham`}
              className="hover:text-foreground transition-colors"
            >
              {translations.goProducts}
            </Link>{" "}
            •{" "}
            <Link
              href={`/${lang}/gioi-thieu`}
              className="hover:text-foreground transition-colors"
            >
              {translations.nav.about}
            </Link>{" "}
            •{" "}
            <Link
              href={`/${lang}/lien-he`}
              className="hover:text-foreground transition-colors"
            >
              {translations.nav.contact}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
