import { FloatingContact } from "@/components/common/floating-contact";
import { FullPageLoader } from "@/components/common/LoadingSpinner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ReactNode, Suspense } from "react";
import { Locale, getTranslations } from "@/lib/i18n-server";
import { Metadata } from "next";
import { COMPANY_INFO } from "@/data/company-info";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isVi = lang === "vi";
  const translations = await getTranslations(lang);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon | Sỉ/Lẻ"
        : "FreshFruit - Premium Fresh Fruits | Wholesale/Retail",
      template: isVi ? "%s | FreshFruit" : "%s | FreshFruit",
    },
    description: isVi
      ? "FreshFruit - Nhà cung cấp sỉ/lẻ trái cây nội địa chất lượng cao đáng tin cậy. Chuyên cung cấp trái cây tươi ngon cho đại lý, cửa hàng và doanh nghiệp. Cam kết chất lượng và giá cả cạnh tranh."
      : "FreshFruit - Your trusted wholesale/retail supplier of high-quality local fruits. Specializing in fresh fruits for retailers, stores and businesses. Committed to quality and competitive pricing.",
    keywords: isVi
      ? "trái cây, trái cây tươi, trái cây nội địa, trái cây cao cấp, bỏ sỉ trái cây, đại lý trái cây, FreshFruit, trái cây Việt Nam, trái cây sạch, trái cây hữu cơ"
      : "fruits, fresh fruits, local fruits, premium fruits, wholesale fruits, fruit retailer, FreshFruit, Vietnamese fruits, organic fruits, fresh produce",
    authors: [{ name: COMPANY_INFO.name.vi }],
    creator: COMPANY_INFO.name.vi,
    publisher: COMPANY_INFO.name.vi,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/images/logo-khangmy.webp",
      apple: "/images/logo-khangmy.webp",
    },
    openGraph: {
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      alternateLocale: isVi ? "en_US" : "vi_VN",
      url: `${baseUrl}/${lang}`,
      siteName: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon"
        : "FreshFruit - Premium Fresh Fruits",
      title: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon | Sỉ/Lẻ"
        : "FreshFruit - Premium Fresh Fruits | Wholesale/Retail",
      description: isVi
        ? "FreshFruit - Nhà cung cấp sỉ/lẻ trái cây nội địa chất lượng cao đáng tin cậy. Chuyên cung cấp trái cây tươi ngon cho đại lý, cửa hàng và doanh nghiệp."
        : "FreshFruit - Your trusted wholesale/retail supplier of high-quality local fruits. Specializing in fresh fruits for retailers, stores and businesses.",
      images: [
        {
          url: `${baseUrl}/images/logo-khangmy.webp`,
          width: 1200,
          height: 630,
          alt: isVi
            ? "FreshFruit - Trái Cây Tươi Ngon"
            : "FreshFruit - Premium Fresh Fruits",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "FreshFruit - Trái Cây Tươi Ngon | Sỉ/Lẻ"
        : "FreshFruit - Premium Fresh Fruits | Wholesale/Retail",
      description: isVi
        ? "Nhà cung cấp sỉ/lẻ trái cây nội địa chất lượng cao đáng tin cậy"
        : "Your trusted wholesale/retail supplier of high-quality local fruits",
      images: [`${baseUrl}/images/logo-khangmy.webp`],
    },
    alternates: {
      languages: {
        vi: `${baseUrl}/vi`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/vi`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`storefront font-sans ${roboto.variable} ${robotoMono.variable}`}
        suppressHydrationWarning
      >
        <Suspense fallback={<FullPageLoader />}>
          <Header lang={lang} />
          <main>{children}</main>
          <Footer lang={lang} />
          <FloatingContact />
        </Suspense>
      </body>
    </html>
  );
}
