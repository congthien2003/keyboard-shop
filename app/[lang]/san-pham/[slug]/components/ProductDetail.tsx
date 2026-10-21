"use client";

import { ProductResponse } from "@/services/product-service";
import type { Locale } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { formatUsd, formatVnd } from "@/lib/formatAmount";
import { ProductStatus } from "@/types/product";
import { ProductImageGallery } from "./ProductImageGallery";
import { AddToCartSection } from "./AddToCartSection";
import Link from "next/link";
import { ProductCard } from "@/components/common/product-card";

interface ProductDetailProps {
  product: ProductResponse;
  lang: Locale;
  relatedProducts?: ProductResponse[];
}

export function ProductDetail({
  product,
  lang,
  relatedProducts = [],
}: ProductDetailProps) {
  const translateVi = product.translates.find((t) => t.lang === "vi");
  const translateEn = product.translates.find((t) => t.lang === "en");
  const translate = lang === "vi" ? translateVi : translateEn || translateVi;

  const productName = translate?.name || "";
  const productDescription = translate?.description || "";
  const productPrice = translate?.price || 0;
  const productUnit = translate?.unit || "";
  const productFromCountry = translate?.fromCountry || "";

  const images =
    product.image && product.image.length > 0
      ? product.image
      : [product.thumbnail];

  const renderStatusChip = () => {
    let label = "";
    let colorClass = "bg-muted text-foreground";
    // if (product.status === ProductStatus.CONTACT) {
    // 	label = lang === "vi" ? "Liên hệ" : "Contact";
    // 	colorClass = "bg-amber-100 text-amber-800";
    // } else if (product.status === ProductStatus.SOLD) {
    // 	label = lang === "vi" ? "Hết hàng" : "Out of Stock";
    // 	colorClass = "bg-red-100 text-red-700";
    // } else {
    // 	label = lang === "vi" ? "Còn hàng" : "In Stock";
    // 	colorClass = "bg-emerald-100 text-emerald-700";
    // }
    if (product.status === ProductStatus.SOLD) {
      label = lang === "vi" ? "Hết hàng" : "Out of Stock";
      colorClass = "bg-red-100 text-red-700";
    } else {
      label = lang === "vi" ? "Còn hàng" : "In Stock";
      colorClass = "bg-emerald-100 text-emerald-700";
    }

    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImageGallery
            thumbnail={product.thumbnail || "/placeholder.svg"}
            images={images}
            productName={productName}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">
                {productName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <span>•</span>
                <span>
                  {lang === "vi" ? "Lượt xem" : "Views"}: {product.viewCount}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.status === ProductStatus.CONTACT ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {lang === "vi" ? "Giá Liên hệ" : "Price Contact"}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {lang === "vi"
                        ? formatVnd(productPrice)
                        : formatUsd(productPrice)}
                    </span>
                    {translate?.originalPrice ? (
                      <span className="text-lg text-muted-foreground line-through">
                        {lang === "vi"
                          ? formatVnd(translate.originalPrice)
                          : formatUsd(translate.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                </>
              )}

              <div className="text-sm text-muted-foreground">
                {lang === "vi" ? "Đơn vị" : "Unit"}:{" "}
                <span className="font-medium">{productUnit}</span>
              </div>
            </div>

            {/* Details */}
            <Card className="storefront-card bg-secondary/35">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {translate?.weight ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === "vi" ? "Trọng lượng" : "Weight"}:
                      </span>
                      <span className="font-medium">{translate.weight}</span>
                    </div>
                  ) : null}
                  {productFromCountry ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === "vi" ? "Xuất xứ" : "Origin"}:
                      </span>
                      <span className="font-medium">{productFromCountry}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {lang === "vi" ? "Trạng thái" : "Status"}:
                    </span>
                    {renderStatusChip()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Actions */}
            <AddToCartSection
              productId={product.id}
              productName={translateEn?.name || ""}
              productNameVi={translateVi?.name || ""}
              price={translateEn?.price || 0}
              priceVND={translateVi?.price || 0}
              image={
                (product.image && product.image.length > 0
                  ? product.image[0]
                  : product.thumbnail) || ""
              }
              unit={productUnit}
              orderLabel={lang === "vi" ? "Đặt hàng" : "Order"}
              addToCartLabel={
                lang === "vi" ? "Thêm vào giỏ hàng" : "Add to Cart"
              }
              contactLabel={lang === "vi" ? "Liên hệ" : "Contact"}
              lang={lang}
            />

            {/* Description */}
            {productDescription ? (
              <Card className="storefront-card">
                <CardContent className="px-4">
                  <h3 className="mb-3 text-lg font-semibold">
                    {lang === "vi" ? "Mô tả sản phẩm" : "Product Description"}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {productDescription.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="storefront-section storefront-section-muted mt-12 flex flex-col gap-8 !py-12">
        <div className="container mx-auto px-4">
          {/* Product Info (HTML) */}
          {translate?.info ? (
            <div className="storefront-card mt-4 space-y-6 p-6 md:p-8">
              <h3 className="mb-4 text-center text-xl font-bold text-primary">
                {lang === "vi" ? "Thông tin sản phẩm" : "Product Information"}
              </h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: translate.info,
                }}
              />
            </div>
          ) : null}

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary px-6 py-3 shadow-sm">
              <p className="text-center text-sm font-bold text-primary-foreground italic">
                {lang === "vi"
                  ? "FreshFruit cam kết 100% nói không với chất bảo quản & trái cây Trung Quốc!"
                  : "FreshFruit commits 100% no preservatives & Chinese fruits!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="storefront-section !pt-0">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold mb-4">
              {lang === "vi" ? "Sản phẩm liên quan" : "Related Products"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">
                <Link href={`/${lang}/san-pham`}>
                  {lang === "vi" ? "Xem tất cả sản phẩm" : "View All Products"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
