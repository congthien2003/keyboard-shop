"use client";

import { ProductCard } from "@/components/common/product-card";
import { ProductResponse } from "@/services/product-service";
import type { Locale } from "@/lib/types";

interface ProductsGridProps {
  products: ProductResponse[];
  lang: Locale;
}

export function ProductsGrid({ products, lang }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="storefront-card flex h-64 items-center justify-center text-center text-muted-foreground">
        <p>{lang === "vi" ? "Chưa có sản phẩm nào" : "No products yet"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}
