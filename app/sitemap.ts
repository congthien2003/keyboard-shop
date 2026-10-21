import { MetadataRoute } from "next";
import { productService } from "@/services/product-service";
import { newsService } from "@/services/news-service";
import { COMPANY_INFO } from "@/data/company-info";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${COMPANY_INFO.contact.website}`;
  const locales = ["vi", "en"] as const;

  // Static pages with locale in URL
  const staticPages: MetadataRoute.Sitemap = [];

  // Root URL redirects to /vi (default locale)
  // staticPages.push({
  // 	url: baseUrl,
  // 	lastModified: new Date(),
  // 	changeFrequency: "daily",
  // 	priority: 1,
  // 	alternates: {
  // 		languages: {
  // 			vi: `${baseUrl}/vi`,
  // 			en: `${baseUrl}/en`,
  // 			"x-default": `${baseUrl}/vi`,
  // 		},
  // 	},
  // });

  // Home page for each locale
  locales.forEach((locale) => {
    staticPages.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          vi: `${baseUrl}/vi`,
          en: `${baseUrl}/en`,
          "x-default": `${baseUrl}/vi`,
        },
      },
    });
  });

  // Other static pages for each locale
  const staticRoutes = [
    { path: "san-pham", priority: 0.9, changeFrequency: "daily" as const },
    {
      path: "gioi-thieu",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    { path: "lien-he", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "gio-hang", priority: 0.8, changeFrequency: "daily" as const },
    {
      path: "chinh-sach/giao-hang",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      path: "chinh-sach/huong-dan-dat-hang",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      path: "chinh-sach/bao-mat",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
  ];

  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      staticPages.push({
        url: `${baseUrl}/${locale}/${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/${route.path}`,
            en: `${baseUrl}/en/${route.path}`,
            "x-default": `${baseUrl}/vi/${route.path}`,
          },
        },
      });
    });
  });

  // Dynamic product pages for each locale
  const products = await productService.getAllProducts();
  const productPages: MetadataRoute.Sitemap = [];

  products.forEach((product) => {
    locales.forEach((locale) => {
      productPages.push({
        url: `${baseUrl}/${locale}/san-pham/${product.slug}`,
        lastModified: product.updatedAt || product.createdAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/san-pham/${product.slug}`,
            en: `${baseUrl}/en/san-pham/${product.slug}`,
            "x-default": `${baseUrl}/vi/san-pham/${product.slug}`,
          },
        },
      });
    });
  });

  // Dynamic news pages (if news pages exist in [lang] structure)
  // For now, we'll keep the old structure if news is not in [lang]
  const newsList = await newsService.getNewsList(1, 1000, "vi");
  const newsPages: MetadataRoute.Sitemap = [];

  // Check if news pages are in [lang] structure or old structure
  // For now, assuming they might be in old structure, we'll add both
  newsList.data.forEach((news) => {
    // Add for old structure (if exists)
    newsPages.push({
      url: `${baseUrl}/tin-tuc/${news.slug}`,
      lastModified: news.updatedAt || news.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          vi: `${baseUrl}/tin-tuc/${news.slug}`,
          en: `${baseUrl}/tin-tuc/${news.slug}`,
          "x-default": `${baseUrl}/tin-tuc/${news.slug}`,
        },
      },
    });

    // Add for new structure with locale (if exists)
    locales.forEach((locale) => {
      newsPages.push({
        url: `${baseUrl}/${locale}/tin-tuc/${news.slug}`,
        lastModified: news.updatedAt || news.createdAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi/tin-tuc/${news.slug}`,
            en: `${baseUrl}/en/tin-tuc/${news.slug}`,
            "x-default": `${baseUrl}/vi/tin-tuc/${news.slug}`,
          },
        },
      });
    });
  });

  return [...staticPages, ...productPages, ...newsPages];
}
