"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { ProductImage as Image } from "@/components/common/product-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsData } from "@/types/news";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Facebook, Copy, Check } from "lucide-react";
import type { Locale } from "@/lib/types";

export function NewsDetailClient({
  lang,
  article,
  relatedArticles,
}: {
  lang: Locale;
  article: NewsData;
  relatedArticles: NewsData[];
}) {
  // Translation texts
  const texts = {
    vi: {
      breadcrumbHome: "Trang Chủ",
      breadcrumbNews: "Tin Tức",
      author: "Đội ngũ biên tập SB-MechKey",
      timeReadingSuffix: "phút",
      viewsSuffix: "lượt xem",
      likes: "Lượt Thích",
      share: "Chia Sẻ",
      aboutAuthor: "Về Tác Giả",
      authorTitle: "Đội Ngũ Biên Tập SB-MechKey",
      articleStats: "Thống Kê Bài Viết",
      views: "Lượt Xem",
      readTime: "Thời Gian Đọc",
      relatedArticles: "Bài Viết Liên Quan",
      backToNews: "Quay Lại Tin Tức",
      errorTitle: "Lỗi",
      notFound: "Không tìm thấy bài viết",
      shareNews: "Chia Sẻ Tin Tức",
      shareToYourFriends: "Chia Sẻ Với Bạn Bè",
      shareToFacebook: "Chia Sẻ Lên Facebook",
      copyLink: "Sao Chép Liên Kết",
      linkCopied: "Đã sao chép liên kết!",
    },
    en: {
      breadcrumbHome: "Home",
      breadcrumbNews: "News",
      author: "SB-MechKey Editorial Team",
      timeReadingSuffix: "minutes",
      viewsSuffix: "views",
      likes: "Likes",
      share: "Share",
      aboutAuthor: "About Author",
      authorTitle: "SB-MechKey's Editorial Team",
      articleStats: "Article Stats",
      views: "Views",
      readTime: "Read Time",
      relatedArticles: "Related Articles",
      backToNews: "Back to News",
      errorTitle: "Error",
      notFound: "Article not found",
      shareNews: "Share News",
      shareToYourFriends: "Share to your friends",
      shareToFacebook: "Share to Facebook",
      copyLink: "Copy Link",
      linkCopied: "Link copied!",
    },
  };

  const t = texts[lang];

  if (!article) {
    return (
      <div className="grow flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          {t.errorTitle}
        </h1>
        <p className="text-muted-foreground mb-6">{t.notFound}</p>
        <Link href={`/${lang}/tin-tuc`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToNews}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <NewsArticleView
      lang={lang}
      article={article}
      relatedArticles={relatedArticles}
      t={t}
    />
  );
}

// This is a client component to handle UI and interactions
function NewsArticleView({
  lang,
  article,
  relatedArticles,
  t,
}: {
  lang: Locale;
  article: NewsData;
  relatedArticles: NewsData[];
  t: any;
}) {
  const pathname = usePathname();
  const [currentLikeCount, setCurrentLikeCount] = useState(
    article.likeCount || 0,
  );
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const title = lang === "vi" ? article.titleVi : article.titleEn;
  const excerpt = lang === "vi" ? article.excerptVi : article.excerptEn;
  const content = lang === "vi" ? article.contentVi : article.contentEn;
  const tags = lang === "vi" ? article.tagsVi : article.tagsEn;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/news/${article.slug}/like`, {
        method: "PUT",
      });

      if (response.ok) {
        setHasLiked(true);
        const result = await response.json();
        if (result.success) {
          setCurrentLikeCount(result.data.likeCount);
        }
      }
    } catch (error) {
      console.error("Failed to like article:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${pathname}`;
    }
    return "";
  };

  const handleShareToFacebook = () => {
    const url = getShareUrl();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="border-b border-primary/10 bg-secondary/45 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground">
            <Link
              href={`/${lang}`}
              className="hover:text-foreground transition-colors"
            >
              {t.breadcrumbHome}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${lang}/tin-tuc`}
              className="hover:text-foreground transition-colors"
            >
              {t.breadcrumbNews}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{title}</span>
          </nav>
        </div>
      </section>

      {/* Article Detail */}
      <section className="storefront-section !pt-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Image */}
              <Card className="storefront-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={article.image}
                      alt={title || "News image"}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                      width={800}
                      height={450}
                      priority
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Article Content */}
              <Card>
                <CardContent className="p-6">
                  <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                    {title}
                  </h1>

                  <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{t.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {article.timeReading} {t.timeReadingSuffix}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>
                        {article.viewCount} {t.viewsSuffix}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    {(tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6 rounded-xl border border-primary/10 bg-secondary/45 p-4">
                    <p className="text-lg font-medium text-foreground">
                      {excerpt}
                    </p>
                  </div>

                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: content || "",
                    }}
                  />

                  <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleLike}
                      disabled={isLiking || hasLiked}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          hasLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {currentLikeCount} {t.likes}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsShareModalOpen(true)}
                    >
                      <Share2 className="h-4 w-4" />
                      {t.share}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <Card className="storefront-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {t.aboutAuthor}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.authorTitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Article Stats */}
              <Card className="storefront-card bg-secondary/30">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {t.articleStats}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.views}:</span>
                      <span className="font-medium">{article.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.likes}:</span>
                      <span className="font-medium">{currentLikeCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.readTime}:
                      </span>
                      <span className="font-medium">
                        {article.timeReading} {t.timeReadingSuffix}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {relatedArticles.length > 0 && (
                <Card className="storefront-card">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      {t.relatedArticles}
                    </h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related) => {
                        const relatedTitle =
                          lang === "vi" ? related.titleVi : related.titleEn;
                        return (
                          <Link
                            key={related.id}
                            href={`/${lang}/tin-tuc/${related.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                                <Image
                                  src={related.image || "/placeholder.webp"}
                                  alt={relatedTitle || "News image"}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                  {relatedTitle}
                                </h4>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatDate(related.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.shareNews}</DialogTitle>
            <DialogDescription>{t.shareToYourFriends}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={handleShareToFacebook}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="flex-1 text-left">{t.shareToFacebook}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="flex-1 text-left">
                {linkCopied ? t.linkCopied : t.copyLink}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
