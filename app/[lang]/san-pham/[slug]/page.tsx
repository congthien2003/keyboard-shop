import type { Locale } from "@/lib/types";
import { productService } from "@/services/product-service";
import { notFound } from "next/navigation";
import { ProductDetail } from "./components/ProductDetail";
import { Metadata } from "next";
import { COMPANY_INFO } from "@/data/company-info";

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

type Props = {
  params: Promise<{
    lang: Locale;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const isVi = lang === "vi";

  const service = productService;
  const product = await service.getProductBySlug(slug);

  if (!product) {
    return {
      title: isVi ? "Sản phẩm không tìm thấy" : "Product Not Found",
    };
  }

  const translateVi =
    product.translates.find((t) => t.lang === "vi") || product.translates[0];
  const translateEn =
    product.translates.find((t) => t.lang === "en") || translateVi;

  const name = isVi ? translateVi?.name : translateEn?.name;
  const description =
    (isVi ? translateVi?.description : translateEn?.description) || "";
  const imageUrl = product.thumbnail || `${baseUrl}/images/logo-khangmy.webp`;
  const price = isVi ? translateVi?.price : translateEn?.price;
  const currency = isVi ? "VND" : "USD";
  const url = `${baseUrl}/${lang}/san-pham/${slug}`;

  return {
    title: isVi
      ? `${name} | FreshFruit - Trái Cây Tươi Ngon`
      : `${name} | FreshFruit - Premium Fresh Fruits`,
    description:
      description ||
      (isVi
        ? `Mua ${name} tại FreshFruit - Trái cây tươi ngon, chất lượng cao`
        : `Buy ${name} at FreshFruit - Fresh, high-quality fruits`),
    keywords: isVi
      ? `${name}, trái cây, trái cây tươi, ${name} FreshFruit, mua ${name}, trái cây nội địa`
      : `${name}, fruits, fresh fruits, ${name} FreshFruit, buy ${name}, local fruits`,
    openGraph: {
      title: isVi
        ? `${name} | FreshFruit - Trái Cây Tươi Ngon`
        : `${name} | FreshFruit - Premium Fresh Fruits`,
      description:
        description ||
        (isVi ? `Mua ${name} tại FreshFruit` : `Buy ${name} at FreshFruit`),
      url,
      siteName: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon"
        : "FreshFruit - Premium Fresh Fruits",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name || "",
        },
      ],
      locale: isVi ? "vi_VN" : "en_US",
      alternateLocale: isVi ? "en_US" : "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: isVi ? `${name} | FreshFruit` : `${name} | FreshFruit`,
      description:
        description ||
        (isVi ? `Mua ${name} tại FreshFruit` : `Buy ${name} at FreshFruit`),
      images: [imageUrl],
    },
    alternates: {
      languages: {
        vi: `${baseUrl}/vi/san-pham/${slug}`,
        en: `${baseUrl}/en/san-pham/${slug}`,
        "x-default": `${baseUrl}/vi/san-pham/${slug}`,
      },
    },
    other: {
      "product:price:amount": price?.toString() || "",
      "product:price:currency": currency,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isVi = lang === "vi";
  // 1. Fetch data from the server
  const [product, relatedProducts] = await Promise.all([
    productService.getProductBySlug(slug),
    productService.getProducts(1, 4),
  ]);

  // If product is not found, show 404 page
  if (!product) {
    notFound();
  }

  const translateVi =
    product.translates.find((t) => t.lang === "vi") || product.translates[0];
  const translateEn =
    product.translates.find((t) => t.lang === "en") || translateVi;

  const productName = isVi ? translateVi?.name : translateEn?.name;
  const productDescription =
    (isVi ? translateVi?.description : translateEn?.description) || "";
  const productPrice = isVi ? translateVi?.price : translateEn?.price;

  // Structured data for product page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    image: product.thumbnail || `${baseUrl}/images/logo-khangmy.webp`,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/${lang}/san-pham/${product.slug}`,
      priceCurrency: isVi ? "VND" : "USD",
      price: productPrice?.toString() || "0",
      availability:
        product.status === 1
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    brand: {
      "@type": "Brand",
      name: COMPANY_INFO.name.vi,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.viewCount.toString(),
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
      <div className="min-h-screen bg-background py-12">
        {/* H1 is in ProductDetail component */}
        <ProductDetail
          product={product}
          lang={lang}
          relatedProducts={relatedProducts}
        />
      </div>
    </>
  );
}
