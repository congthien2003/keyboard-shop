"use client";
import { useState } from "react";
import { ProductImage as Image } from "@/components/common/product-image";

interface ProductImageGalleryProps {
  thumbnail: string;
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  thumbnail,
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-[0_18px_42px_-28px_oklch(0.3_0.07_155/0.6)]">
        <Image
          src={selectedImage === 0 ? thumbnail : images[selectedImage - 1]}
          alt={productName}
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
          width={800}
          height={800}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedImage(0)}
          className={`flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring ${
            selectedImage === 0
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Image
            src={thumbnail}
            alt={`${productName} ${1}`}
            className="h-20 w-20 object-contain"
            width={200}
            height={200}
          />
        </button>
        {images.map((thumb, index) => (
          <button
            key={index + 1}
            onClick={() => setSelectedImage(index + 1)}
            className={`flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring ${
              selectedImage === index + 1
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Image
              src={thumb}
              alt={`${productName} ${index + 2}`}
              className="h-20 w-20 object-contain"
              width={200}
              height={200}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
