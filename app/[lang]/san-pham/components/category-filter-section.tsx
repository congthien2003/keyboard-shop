"use client";

import { CategoryResponse } from "@/services/category-service";
import type { Locale } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterSectionProps {
  lang: Locale;
  categories: CategoryResponse[];
  activeCategory?: string;
  txt: {
    title: string;
    all: string;
  };
}

export function CategoryFilterSection({
  lang,
  categories,
  activeCategory,
  txt,
}: CategoryFilterSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === "all") {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    params.delete("page"); // Reset to page 1 when changing category
    router.push(`/${lang}/san-pham?${params.toString()}`);
  };

  return (
    <div className="storefront-card mb-8 p-5">
      <h2 className="mb-4 text-xl font-semibold">{txt.title}</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={
            activeCategory === undefined || activeCategory === "all"
              ? "default"
              : "outline"
          }
          size="sm"
          className="border-primary/15"
          onClick={() => handleCategoryChange("all")}
        >
          {txt.all}
        </Button>
        {categories.map((category) => {
          const translateVi = category.translates.find((t) => t.lang === "vi");
          const translateEn = category.translates.find((t) => t.lang === "en");
          const slug = translateVi?.slug || translateEn?.slug || category.id;
          const name =
            lang === "vi"
              ? translateVi?.name || translateEn?.name || ""
              : translateEn?.name || translateVi?.name || "";

          return (
            <Button
              key={category.id}
              variant={activeCategory === String(slug) ? "default" : "outline"}
              size="sm"
              className="border-primary/15"
              onClick={() => handleCategoryChange(String(slug))}
            >
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
