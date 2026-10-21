"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/common/product-card";
import { ProductResponse } from "@/services/product-service";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n-server";
import { addToCart } from "@/lib/cart";

interface FruitsSectionClientProps {
  products: ProductResponse[];
  title: string;
  subtitle: string;
  viewAllText: string;
  noProductsText: string;
  showNewBadge?: boolean;
  lang: Locale;
}

export function FruitsSectionClient({
  products,
  title,
  subtitle,
  viewAllText,
  noProductsText,
  showNewBadge = true,
  lang,
}: FruitsSectionClientProps) {
  const router = useRouter();

  const handleAddToCart = (product: ProductResponse) => {
    try {
      const currentTranslate = product.translates.find((t) => t.lang === lang);
      addToCart({
        id: product.id,
        name: currentTranslate?.name || "",
        nameVi: product.translates.find((t) => t.lang === "vi")?.name || "",
        price: product.translates.find((t) => t.lang === "en")?.price || 0,
        priceVND: product.translates.find((t) => t.lang === "vi")?.price || 0,
        image:
          product.image && product.image.length > 0
            ? product.image[0]
            : product.thumbnail || "",
        unit: currentTranslate?.unit || "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleViewAll = () => {
    router.push(`/${lang}/san-pham`);
  };

  return (
    <section className="storefront-section bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="storefront-heading mb-2">
              {title}
            </h2>
            <div className={`h-1 w-24 bg-primary mx-auto rounded-full`} />
          </div>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showNewBadge={showNewBadge}
                  lang={lang}
                />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button
                onClick={handleViewAll}
                size="lg"
                variant="outline"
                className="gap-2 border-primary/20 bg-card hover:bg-secondary hover:text-secondary-foreground"
              >
                {viewAllText}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{noProductsText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
