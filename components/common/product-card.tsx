"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ProductResponse } from "@/services/product-service";
import { formatUsd, formatVnd } from "@/lib/formatAmount";
import Image from "next/image";
import { addToCart } from "@/lib/cart";
import type { Locale } from "@/lib/types";

interface ProductCardProps {
  product: ProductResponse;
  showNewBadge?: boolean;
  onAddToCart?: (product: ProductResponse) => void;
  lang: Locale;
}

export function ProductCard({
  product,
  showNewBadge = true,
  onAddToCart,
  lang = "vi",
}: ProductCardProps) {
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.translates.find((t) => t.lang === lang)?.name || "",
      nameVi: product.translates.find((t) => t.lang === "vi")?.name || "",
      price: product.translates.find((t) => t.lang === "en")?.price || 0,
      priceVND: product.translates.find((t) => t.lang === "vi")?.price || 0,
      image: product.thumbnail || "",
      unit: product.translates.find((t) => t.lang === "en")?.unit || "",
      unitVi: product.translates.find((t) => t.lang === "vi")?.unit || "",
      quantity: 1,
    });
  };

  const handleContact = () => {
    window.location.href = "/lien-he";
  };

  const handleViewDetails = () => {
    window.location.href = `/${lang}/san-pham/${product.slug}`;
  };

  return (
    <Card
      className="storefront-card storefront-card-interactive group cursor-pointer overflow-hidden py-0"
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.translates?.find((t) => t.lang === lang)?.name || ""}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            width={400}
            height={400}
            unoptimized={product.thumbnail?.startsWith("/assets/")}
          />
          {/* {showNewBadge && (
						<div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
							{t("new")}
						</div>
					)} */}
        </div>

        {/* Product Info */}
        <div className="space-y-4 p-5">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {product.translates.find((t) => t.lang === lang)?.name || ""}
            </h3>
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {lang === "vi" ? "Xuất xứ" : "Origin"}:{" "}
                {product.translates.find((t) => t.lang === lang)?.fromCountry ||
                  ""}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {product.status === 3
                ? lang === "vi"
                  ? formatVnd(
                      product.translates.find((t) => t.lang === "vi")?.price ||
                        0,
                    )
                  : formatUsd(
                      product.translates.find((t) => t.lang === "en")?.price ||
                        0,
                    )
                : lang === "vi"
                  ? "Liên hệ"
                  : "Contact"}
            </span>
            <Button
              size="sm"
              className="gap-2 border-primary/20 bg-card hover:bg-secondary hover:text-secondary-foreground"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {lang === "vi" ? "Thêm vào giỏ hàng" : "Add to Cart"}
            </Button>
          </div>

          {/* Contact Button - Full Width */}
          <Button className="w-full gap-2" onClick={handleContact}>
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
