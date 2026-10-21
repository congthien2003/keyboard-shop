import { Metadata } from "next";
import { newsService } from "@/services/news-service";
import { prisma } from "@/lib/prisma";
import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { NewsGrid } from "./components/news-grid";
import { NewsPagination } from "./components/news-pagination";
import { NewsData } from "@/types/news";
import NewsHero from "./components/news-hero";
import { COMPANY_INFO } from "@/data/company-info";

const ITEMS_PER_PAGE = 6;
const baseUrl = `https://${COMPANY_INFO.contact.website}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  return {
    title: t("news.meta.title"),
    description: t("news.meta.description"),
    keywords: t("news.meta.keywords"),
    openGraph: {
      title: t("news.meta.ogTitle"),
      description: t("news.meta.ogDescription"),
      type: "website",
    },
  };
}

interface PageProps {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Get page from search params
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || "1", 10);

  // Fetch data server-side

  // Get published news count
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const total = await prisma.news.count({
    where: { published: true },
  });

  // Fetch news with ALL translations (both vi and en)
  const newsList = await prisma.news.findMany({
    where: { published: true },
    include: {
      translates: {
        select: {
          lang: true,
          title: true,
          excerpt: true,
          tags: true,
        },
      }, // Get all translations
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE,
  });

  // Format news data with both languages
  const formattedNews: NewsData[] = newsList.map((news: any) => {
    const translateVi = news.translates.find((t: any) => t.lang === "vi");
    const translateEn = news.translates.find((t: any) => t.lang === "en");
    const currentTranslate = lang === "vi" ? translateVi : translateEn;
    const fallbackTranslate = translateVi || translateEn || news.translates[0];
    const translate = currentTranslate || fallbackTranslate;

    // Parse tags from JSON string for both languages
    let tagsVi: string[] = [];
    let tagsEn: string[] = [];
    try {
      tagsVi = translateVi?.tags ? JSON.parse(translateVi.tags) : [];
    } catch {
      tagsVi = [];
    }
    try {
      tagsEn = translateEn?.tags ? JSON.parse(translateEn.tags) : [];
    } catch {
      tagsEn = [];
    }

    return {
      id: news.id,
      slug: news.slug,
      image: news.image,
      published: news.published,
      timeReading: news.timeReading,
      viewCount: news.viewCount || 0,
      likeCount: news.likeCount || 0,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt?.toISOString() || null,
      authorId: news.authorId,
      categoryId: news.categoryId,
      // Translation fields - prioritize current language
      title: translate?.title || "",
      titleVi: translateVi?.title || "",
      titleEn: translateEn?.title || "",
      excerpt: translate?.excerpt || "",
      excerptVi: translateVi?.excerpt || "",
      excerptEn: translateEn?.excerpt || "",
      content: "",
      contentVi: "",
      contentEn: "",
      tags: lang === "vi" ? tagsVi : tagsEn,
      tagsVi: tagsVi,
    };
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Structured data for news listing page
  const isVi = lang === "vi";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isVi ? "Tin Tức Trái Cây" : "Fruit News",
    description: isVi
      ? "Tin tức và bài viết về trái cây, dinh dưỡng và sức khỏe"
      : "News and articles about fruits, nutrition and health",
    url: `${baseUrl}/${lang}/tin-tuc`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: formattedNews.slice(0, 10).map((news, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: news.title || "",
          description: news.excerpt || "",
          image: news.image || `${baseUrl}/images/logo-khangmy.webp`,
          url: `${baseUrl}/${lang}/tin-tuc/${news.slug}`,
          datePublished: news.createdAt,
          dateModified: news.updatedAt || news.createdAt,
        },
      })),
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
      {/* Hero Section */}
      <NewsHero title={t("news.title")} subtitle={t("news.subtitle")} />

      {/* News Grid */}
      <section className="storefront-section bg-background">
        <div className="container mx-auto px-4">
          <NewsGrid lang={lang} news={formattedNews} />
          <NewsPagination
            lang={lang}
            currentPage={currentPage}
            totalPages={totalPages}
            txt={{
              previous: t("common.pagination.previous"),
              next: t("common.pagination.next"),
            }}
          />
        </div>
      </section>
    </>
  );
}
