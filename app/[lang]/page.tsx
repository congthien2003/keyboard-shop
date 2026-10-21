import { Metadata } from "next";
import { HeroSection } from "@/components/home-page/hero-section";
import { FruitsSection } from "@/components/home-page/fruits-section";
import { NewsVideoSectionServer } from "@/components/home-page/news-video-section-server";
import { AboutSectionServer } from "@/components/home-page/about-section-server";
import { ContactSection } from "@/components/home-page/contact-section";
import { QualitySection } from "@/components/home-page/quality-section";
import { FAQServer } from "@/components/home-page/faq-server";
import { CustomersServer } from "@/components/home-page/customers-server";
import { TestimonialsServer } from "@/components/home-page/testimonials-server";
import { productService } from "@/services/product-service";
import { newsService } from "@/services/news-service";
import { prisma } from "@/lib/prisma";
import { COMPANY_INFO } from "@/data/company-info";
import { NewsData } from "@/types/news";
import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

type Props = {
  params: { lang: Locale };
};
export default async function HomePage({ params }: Props) {
  // Fetch data server-side
  const { lang } = await params;
  const translations = await getTranslations(lang ?? "vi");
  const t = createTranslator(translations);

  // Fetch products and news in parallel
  const [products, newsResult] = await Promise.all([
    productService.getProducts(1, 12),
    prisma.news.findMany({
      where: { published: true },
      include: {
        translates: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Format news data with translations
  const formattedNews: NewsData[] = newsResult.map((news) => {
    const translateVi = news.translates.find((t) => t.lang === "vi");
    const translateEn = news.translates.find((t) => t.lang === "en");
    const translate = lang === "vi" ? translateVi : translateEn;
    const fallbackTranslate = translateVi || translateEn || news.translates[0];

    // Parse tags from JSON string
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
      // Use current locale translation with fallback
      title: translate?.title || fallbackTranslate?.title || "",
      titleVi: translateVi?.title || fallbackTranslate?.title || "",
      titleEn: translateEn?.title || fallbackTranslate?.title || "",
      excerpt: translate?.excerpt || fallbackTranslate?.excerpt || "",
      excerptVi: translateVi?.excerpt || fallbackTranslate?.excerpt || "",
      excerptEn: translateEn?.excerpt || fallbackTranslate?.excerpt || "",
      content: translate?.content || fallbackTranslate?.content || "",
      contentVi: translateVi?.content || fallbackTranslate?.content || "",
      contentEn: translateEn?.content || fallbackTranslate?.content || "",
      tags: lang === "vi" ? tagsVi : tagsEn,
      tagsVi: tagsVi,
    };
  });

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_INFO.name.vi,
    alternateName: COMPANY_INFO.name.en,
    url: `${baseUrl}/${lang}`,
    logo: `${baseUrl}/images/logo-khangmy.webp`,
    description:
      lang === "vi"
        ? "Nhà cung cấp sỉ/lẻ trái cây nội địa chất lượng cao đáng tin cậy"
        : "Your trusted wholesale/retail supplier of high-quality local fruits",
    address: {
      "@type": "PostalAddress",
      streetAddress: "980/4 Hậu Giang, Phường Phú Lâm",
      addressLocality: "Quận 6",
      addressRegion: "Thành phố Hồ Chí Minh",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_INFO.contact.phone,
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["Vietnamese", "English"],
    },
    sameAs: [COMPANY_INFO.contact.facebook, COMPANY_INFO.contact.zalo],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="min-h-screen">
        <main>
          {/* H1 is in HeroSection component */}
          <HeroSection lang={lang} />
          <FruitsSection products={products} showNewBadge={false} lang={lang} />
          {/* <FruitsSection
					titleKey="home.seasonalFruits.title"
					subtitleKey="home.seasonalFruits.subtitle"
					viewAllKey="home.seasonalFruits.viewAll"
					products={seasonalFruits}
					backgroundColor="bg-background"
					accentColor="bg-primary"
					showNewBadge={true}
				/>
				<FruitsSection
					titleKey="home.organicFruits.title"
					subtitleKey="home.organicFruits.subtitle"
					viewAllKey="home.organicFruits.viewAll"
					products={organicFruits}
					backgroundColor="bg-secondary/30"
					accentColor="bg-accent"
					showNewBadge={false}
				/> */}
          <TestimonialsServer lang={lang} />
          <CustomersServer lang={lang} />
          <QualitySection lang={lang} />
          <NewsVideoSectionServer newsList={formattedNews} lang={lang} />
          <FAQServer lang={lang} />
          <AboutSectionServer lang={lang} />
          <ContactSection lang={lang} />
        </main>
      </div>
    </>
  );
}
