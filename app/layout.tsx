import type React from "react";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { FloatingContact } from "@/components/common/floating-contact";
import { Suspense } from "react";
import { getLocale } from "@/lib/i18n-server";
import { COMPANY_INFO } from "@/data/company-info";
import "./globals.css";
import Script from "next/script";

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isVi = locale === "vi";

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
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      alternateLocale: isVi ? "en_US" : "vi_VN",
      url: baseUrl,
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
        vi: baseUrl,
        en: baseUrl,
        "x-default": baseUrl,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-B0EZQD0T1Q');`,
          }}
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-B0EZQD0T1Q"
        ></Script>
        <meta
          name="google-site-verification"
          content="etSnOB2xEDFeuFnRTt54IBaFpOxuVEFIDyY5zVnpdIY"
        />
        <meta name="msvalidate.01" content="920DF4ABFA95E8F6C6EBC9DF9A0523B5" />
      </head>
      <body
        className={`font-sans ${roboto.variable} ${robotoMono.variable}`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>{children}</I18nProvider>
          <FloatingContact />
        </Suspense>
      </body>
    </html>
  );
}
