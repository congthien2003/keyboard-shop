import { Metadata } from "next";
import { notFound } from "next/navigation";
import { newsService } from "@/services/news-service";
import { Locale } from "@/lib/i18n-server";
import { COMPANY_INFO, SITE_URL } from "@/data/company-info";
import { NewsDetailClient } from "./NewsDetailClient";

const baseUrl = SITE_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const isVi = lang === "vi";

  const article = await newsService.getNewsBySlug(slug);

  if (!article) {
    return {
      title: isVi ? "Tin tức không tìm thấy" : "News Not Found",
    };
  }

  const title = isVi ? article.titleVi : article.titleEn;
  const excerpt = isVi ? article.excerptVi : article.excerptEn;
  const imageUrl = article.image || `${baseUrl}/images/mechkey/logo.svg`;
  const url = `${baseUrl}/${lang}/tin-tuc/${slug}`;
  const publishedTime = article.createdAt;
  const modifiedTime = article.updatedAt || article.createdAt;

  return {
    title: isVi
      ? `${title} | SB-MechKey - Bàn Phím & Phụ Kiện`
      : `${title} | SB-MechKey - Keyboards & Accessories`,
    description:
      excerpt ||
      (isVi
        ? `Đọc tin tức ${title} tại SB-MechKey`
        : `Read news ${title} at SB-MechKey`),
    keywords: isVi
      ? `${title}, tin tức, bàn phím, ${title} SB-MechKey, tin tức bàn phím`
      : `${title}, news, keyboards, ${title} SB-MechKey, keyboard news`,
    openGraph: {
      title: isVi
        ? `${title} | SB-MechKey - Bàn Phím & Phụ Kiện`
        : `${title} | SB-MechKey - Keyboards & Accessories`,
      description:
        excerpt ||
        (isVi
          ? `Đọc tin tức ${title} tại SB-MechKey`
          : `Read news ${title} at SB-MechKey`),
      url,
      siteName: isVi
        ? "SB-MechKey - Bàn Phím & Phụ Kiện"
        : "SB-MechKey - Keyboards & Accessories",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || "",
        },
      ],
      locale: isVi ? "vi_VN" : "en_US",
      alternateLocale: isVi ? "en_US" : "vi_VN",
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: [COMPANY_INFO.name.vi],
    },
    twitter: {
      card: "summary_large_image",
      title: isVi ? `${title} | SB-MechKey` : `${title} | SB-MechKey`,
      description:
        excerpt ||
        (isVi
          ? `Đọc tin tức ${title} tại SB-MechKey`
          : `Read news ${title} at SB-MechKey`),
      images: [imageUrl],
    },
    alternates: {
      languages: {
        vi: `${baseUrl}/vi/tin-tuc/${slug}`,
        en: `${baseUrl}/en/tin-tuc/${slug}`,
        "x-default": url,
      },
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = await newsService.getNewsBySlug(slug);
  const newsRelated = await newsService.getRelatedNews(slug, 3);

  if (!article) {
    return notFound();
  }

  const isVi = lang === "vi";
  const title = isVi ? article.titleVi : article.titleEn;
  const excerpt = isVi ? article.excerptVi : article.excerptEn;
  const content = isVi ? article.contentVi : article.contentEn;
  const imageUrl = article.image || `${baseUrl}/images/mechkey/logo.svg`;
  const publishedTime = article.createdAt;
  const modifiedTime = article.updatedAt || article.createdAt;

  // Structured data for news article
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: excerpt,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      "@type": "Organization",
      name: COMPANY_INFO.name.vi,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.name.vi,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/mechkey/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${lang}/tin-tuc/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <NewsDetailClient
        lang={lang}
        article={article}
        relatedArticles={newsRelated}
      />
    </>
  );
}
