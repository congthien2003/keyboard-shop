"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { NewsData } from "@/types/news";
import { useNews } from "@/hooks/useNews";

interface NewsScrollClientProps {
  newsList: NewsData[];
  locale: string;
}

export function NewsScrollClient({ newsList, locale }: NewsScrollClientProps) {
  const { incrementView } = useNews();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isScrollReady, setIsScrollReady] = useState(false);

  const handleNewsClick = async (slug: string) => {
    // Increment view count before navigating
    try {
      await incrementView(slug);
    } catch (error) {
      console.error("Failed to increment view count:", error);
      // Continue navigation even if view increment fails
    }

    // Navigate to article
    window.location.href = `/${locale}/tin-tuc/${slug}`;
  };

  // Check if scroll is ready after DOM render
  useEffect(() => {
    if (!scrollContainerRef.current || newsList.length === 0) return;

    const checkScrollReady = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        setIsScrollReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkScrollReady, 100);
      }
    };

    // Wait for images and content to load
    setTimeout(checkScrollReady, 200);
  }, [newsList]);

  // Auto scroll news continuously
  useEffect(() => {
    if (
      !isAutoScrolling ||
      !scrollContainerRef.current ||
      !isScrollReady ||
      newsList.length === 0
    )
      return;

    const scrollSpeed = 0.8; // pixels per frame
    const scrollContainer = scrollContainerRef.current;

    const animate = () => {
      if (!isAutoScrolling || !scrollContainer) return;

      const currentScroll = scrollContainer.scrollTop;
      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      if (maxScroll <= 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const newScroll = currentScroll + scrollSpeed;

      // Reset to top when reaching 75% of max scroll for smooth loop
      if (newScroll >= maxScroll * 0.75) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop = newScroll;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScrolling, isScrollReady, newsList]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderNewsCard = (news: NewsData, key: string) => (
    <Card
      key={key}
      className="storefront-card storefront-card-interactive flex-shrink-0 cursor-pointer overflow-hidden"
      onClick={() => handleNewsClick(news.slug)}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-32 h-24 overflow-hidden">
            <Image
              src={news.image || "/placeholder.webp"}
              alt={news.title || "News image"}
              className="h-full w-full object-cover"
              width={128}
              height={96}
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDate(news.createdAt)}
              </span>
            </div>
            <h4 className="text-sm font-semibold line-clamp-2 mb-2">
              {news.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {news.excerpt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide storefront-card relative h-[50vh] overflow-y-auto"
      onMouseEnter={() => setIsAutoScrolling(false)}
      onMouseLeave={() => setIsAutoScrolling(true)}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {newsList.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Chưa có bài viết nào.
        </div>
      ) : (
        <div className="flex flex-col space-y-4 p-4">
          {/* Render news multiple times to ensure scrollable content */}
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`group-${index}`} className="space-y-4">
              {newsList.map((news) =>
                renderNewsCard(news, `${index}-${news.id}`),
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
