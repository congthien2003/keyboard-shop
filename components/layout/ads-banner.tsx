"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdItem {
  id: number;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  cta: string;
  ctaVi: string;
  link: string;
  backgroundColor: string;
  textColor: string;
}

const adsData: AdItem[] = [
  {
    id: 1,
    title: "Special Wholesale Offer",
    titleVi: "Ưu Đãi Bỏ Sỉ Đặc Biệt",
    description: "Get 10% off on orders over 100kg",
    descriptionVi: "Giảm 10% cho đơn hàng trên 100kg",
    cta: "Contact Now",
    ctaVi: "Liên Hệ Ngay",
    link: "/lien-he",
    backgroundColor: "bg-primary/95",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Fresh Daily Delivery",
    titleVi: "Giao Hàng Tươi Mỗi Ngày",
    description: "Same-day delivery for all retailers",
    descriptionVi: "Giao hàng trong ngày cho tất cả đại lý",
    cta: "Learn More",
    ctaVi: "Tìm Hiểu Thêm",
    link: "/gioi-thieu",
    backgroundColor: "bg-primary/95",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Quality Guarantee",
    titleVi: "Cam Kết Chất Lượng",
    description: "100% satisfaction or money back",
    descriptionVi: "100% hài lòng hoặc hoàn tiền",
    cta: "View Products",
    ctaVi: "Xem Sản Phẩm",
    link: "/san-pham",
    backgroundColor: "bg-primary/95",
    textColor: "text-white",
  },
];

export function AdsBanner({ lang }: { lang: "vi" | "en" }) {
  return (
    <div
      className={`relative overflow-hidden border-b border-primary-foreground/10 ${adsData[0].backgroundColor} ${adsData[0].textColor}`}
    >
      <div className="py-2">
        <div className="flex">
          {/* Scrolling text */}
          <div className="">
            <div className="animate-scroll whitespace-nowrap min-w-screen flex">
              <span className="text-sm font-semibold w-screen">
                {lang === "vi"
                  ? adsData[0].descriptionVi
                  : adsData[0].description}
              </span>
              <span className="text-sm font-semibold w-screen">
                {lang === "vi"
                  ? adsData[1].descriptionVi
                  : adsData[1].description}
              </span>
              <span className="text-sm font-semibold w-screen">
                {lang === "vi"
                  ? adsData[2].descriptionVi
                  : adsData[2].description}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
