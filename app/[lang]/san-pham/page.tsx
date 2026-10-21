import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { productService } from "@/services/product-service";
import { categoryService } from "@/services/category-service";
import { CategoryFilterSection } from "./components/category-filter-section";
import { ProductsGrid } from "./components/products-grid";
import { Pagination } from "./components/pagination";
import { ProductsHero } from "./components/products-hero";
import { Metadata } from "next";
import { COMPANY_INFO } from "@/data/company-info";

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

// Define props for the page, including search parameters
type Props = {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isVi = lang === "vi";
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const title = isVi
    ? "Sản Phẩm - Trái Cây Cao Cấp | FreshFruit"
    : "Products - Premium Fresh Fruits | FreshFruit";
  const description = isVi
    ? "Khám phá bộ sưu tập trái cây cao cấp nhập khẩu và nội địa của FreshFruit. Trái cây tươi ngon, chất lượng cao, đa dạng chủng loại."
    : "Discover FreshFruit's collection of premium imported and local fruits. Fresh, high-quality fruits with diverse varieties.";

  return {
    title,
    description,
    keywords: isVi
      ? "trái cây, trái cây cao cấp, trái cây nhập khẩu, trái cây tươi, FreshFruit, sản phẩm trái cây"
      : "fruits, premium fruits, imported fruits, fresh fruits, FreshFruit, fruit products",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/san-pham`,
      siteName: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon"
        : "FreshFruit - Premium Fresh Fruits",
      images: [
        {
          url: `${baseUrl}/images/logo-khangmy.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isVi ? "vi_VN" : "en_US",
      alternateLocale: isVi ? "en_US" : "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/logo-khangmy.webp`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/san-pham`,
      languages: {
        vi: `${baseUrl}/vi/san-pham`,
        en: `${baseUrl}/en/san-pham`,
        "x-default": `${baseUrl}/vi/san-pham`,
      },
    },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const isVi = lang === "vi";
  // 1. Load translations from the server
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // 2. Fetch data based on search params
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 12;
  const categorySlug = resolvedSearchParams.category;

  // Fetch data server-side
  const [allProducts, fetchedCategories] = await Promise.all([
    productService.getAllProducts(),
    categoryService.getAllCategories(),
  ]);

  // Pagination
  const totalPages = Math.ceil(allProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // Prepare translated texts for child components
  const heroTxt = {
    title: t("products.title"),
    subtitle: t("products.subtitle"),
  };

  const filterTxt = {
    title: t("products.categories.title"),
    all: t("products.categories.all"),
  };

  // Structured data for products page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isVi ? "Sản Phẩm Trái Cây" : "Fruit Products",
    description: isVi
      ? "Bộ sưu tập trái cây cao cấp nhập khẩu và nội địa của FreshFruit"
      : "FreshFruit's collection of premium imported and local fruits",
    url: `${baseUrl}/${lang}/san-pham`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allProducts.length,
      itemListElement: currentProducts.slice(0, 10).map((product, index) => {
        const translateVi = product.translates.find((t) => t.lang === "vi");
        const translateEn = product.translates.find((t) => t.lang === "en");
        const translate = isVi ? translateVi : translateEn || translateVi;

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: translate?.name || "",
            description: translate?.description || "",
            image: product.thumbnail || `${baseUrl}/images/logo-khangmy.webp`,
            url: `${baseUrl}/${lang}/san-pham/${product.slug}`,
          },
        };
      }),
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
      <div className="min-h-screen bg-background">
        {/* H1 is in ProductsHero component */}
        <ProductsHero lang={lang} txt={heroTxt} />

        <section className="storefront-section !pt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4">
              {/* Category Filter (Client Component) */}
              <CategoryFilterSection
                lang={lang}
                categories={fetchedCategories}
                activeCategory={categorySlug}
                txt={filterTxt}
              />

              {/* Products Grid and Pagination */}
              <div className="">
                <ProductsGrid products={currentProducts} lang={lang} />
                <Pagination
                  lang={lang}
                  currentPage={page}
                  totalPages={totalPages}
                  txt={{
                    previous: t("common.pagination.previous"),
                    next: t("common.pagination.next"),
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
