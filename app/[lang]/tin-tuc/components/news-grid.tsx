"use client";

import PostCard from "./post-card";
import { NewsData } from "@/types/news";
import type { Locale } from "@/lib/types";

interface NewsGridProps {
  lang: Locale;
  news: NewsData[];
}

export function NewsGrid({ lang, news }: NewsGridProps) {
  if (news.length === 0) {
    return (
      <div className="storefront-card flex h-64 items-center justify-center text-center text-muted-foreground">
        <p>{lang === "vi" ? "Chưa có bài viết nào" : "No articles yet"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {news.map((article) => (
        <PostCard key={article.id} post={article} lang={lang} />
      ))}
    </div>
  );
}
