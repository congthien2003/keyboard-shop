"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { Locale } from "@/lib/i18n-server";

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productNameVi: string;
  price: number;
  priceVND: number;
  image: string;
  unit: string;
  unitVi?: string;
  orderLabel: string;
  addToCartLabel: string;
  contactLabel: string;
  lang: Locale;
}

export function AddToCartSection({
  productId,
  productName,
  productNameVi,
  price,
  priceVND,
  image,
  unit,
  unitVi,
  orderLabel,
  addToCartLabel,
  contactLabel,
  lang,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;
    setAdded(true);
    addToCart({
      id: productId,
      name: productName,
      nameVi: productNameVi,
      price: price,
      priceVND: priceVND,
      image: image,
      unit: unit,
      unitVi,
      quantity,
    });
  };

  const handleContact = () => {
    window.location.href = `/${lang}/lien-he`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{orderLabel}:</span>
        <div className="flex items-center gap-1 rounded-xl border border-primary/15 bg-card p-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            aria-label={lang === "vi" ? "Số lượng" : "Quantity"}
            type="number"
            value={quantity}
            onChange={(e) => { const value = Number(e.target.value); setQuantity(Number.isSafeInteger(value) && value > 0 ? value : 1); }}
            className="w-16 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          className="flex-1 gap-2 shadow-[0_12px_24px_-16px_oklch(0.3_0.07_155/0.8)]"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5" />
          {added ? (lang === "vi" ? "Đã thêm vào giỏ" : "Added to cart") : addToCartLabel}
        </Button>
        <Button
          onClick={handleContact}
          variant="outline"
          className="flex-1 gap-2 border-primary/20 bg-card hover:bg-secondary hover:text-secondary-foreground"
          size="lg"
        >
          {contactLabel}
        </Button>
      </div>
    </div>
  );
}
