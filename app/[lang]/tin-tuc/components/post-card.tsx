"use client";

import { NewsData } from "@/types/news";
import { Calendar, ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

import type { Locale } from "@/lib/types";

type Props = {
  post: NewsData;
  lang: Locale;
};

function PostCard({ post, lang }: Props) {
  const handleArticleClick = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    // Increment view count
    try {
      await fetch(`/api/news/${slug}/view`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
    window.location.href = `/${lang}/tin-tuc/${slug}`;
  };

  const handleReadMore = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();

    // Increment view count
    try {
      await fetch(`/api/news/${slug}/view`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }

    // Navigate to article
    window.location.href = `/${lang}/tin-tuc/${slug}`;
  };

  const title =
    lang === "vi" ? post.titleVi || post.title : post.titleEn || post.title;
  const excerpt =
    lang === "vi"
      ? post.excerptVi || post.excerpt
      : post.excerptEn || post.excerpt;

  const readMoreText = lang === "vi" ? "Đọc Thêm" : "Read More";

  return (
    <article
      className="storefront-card storefront-card-interactive group flex cursor-pointer flex-col overflow-hidden"
      onClick={(e) => handleArticleClick(e, post.slug)}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={post.image || "/placeholder.webp"}
          alt={title || "News image"}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6 flex flex-col grow">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString(
              lang === "vi" ? "vi-VN" : "en-US",
            )}
          </time>
        </div>
        <h2 className="mb-3 text-balance text-xl font-semibold transition-colors group-hover:text-primary">{title}</h2>
        <p className="mb-4 text-pretty text-muted-foreground line-clamp-3 grow">
          {excerpt}
        </p>
        <div className="inline-block mt-auto">
          <Button
            variant="link"
            className="gap-2 p-0"
            onClick={(e) => handleReadMore(e, post.slug)}
          >
            {readMoreText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
