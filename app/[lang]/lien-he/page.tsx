import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { ContactSection } from "@/components/home-page/contact-section";
import { Metadata } from "next";
import { COMPANY_INFO } from "@/data/company-info";

const baseUrl = `https://${COMPANY_INFO.contact.website}`;

type Props = {
  params: Promise<{ lang: Locale }>;
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
    ? "Liên Hệ - FreshFruit | Trái Cây Tươi Ngon"
    : "Contact - FreshFruit | Premium Fresh Fruits";
  const description = isVi
    ? `Liên hệ với FreshFruit - ${t("contact.hero-subtitle")}`
    : `Contact FreshFruit - ${t("contact.hero-subtitle")}`;

  return {
    title,
    description,
    keywords: isVi
      ? "liên hệ, FreshFruit, trái cây, địa chỉ, điện thoại, email"
      : "contact, FreshFruit, fruits, address, phone, email",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/lien-he`,
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
      languages: {
        vi: `${baseUrl}/vi/lien-he`,
        en: `${baseUrl}/en/lien-he`,
        "x-default": `${baseUrl}/vi/lien-he`,
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const isVi = lang === "vi";
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Structured data for contact page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isVi ? "Liên Hệ - FreshFruit" : "Contact - FreshFruit",
    description: isVi
      ? `Liên hệ với FreshFruit - ${t("contact.hero-subtitle")}`
      : `Contact FreshFruit - ${t("contact.hero-subtitle")}`,
    url: `${baseUrl}/${lang}/lien-he`,
    mainEntity: {
      "@type": "Organization",
      name: COMPANY_INFO.name.vi,
      alternateName: COMPANY_INFO.name.en,
      url: baseUrl,
      logo: `${baseUrl}/images/logo-khangmy.webp`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: COMPANY_INFO.contact.phone,
        email: COMPANY_INFO.contact.email,
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese", "English"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "980/4 Hậu Giang, Phường Phú Lâm",
        addressLocality: "Quận 6",
        addressRegion: "Thành phố Hồ Chí Minh",
        addressCountry: "VN",
      },
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
      <div className="storefront-content-page bg-background">
        {/* Hero Section */}
        <section
          className="relative py-40 text-primary-foreground"
          style={{
            backgroundImage: "url(/images/hero-banner-12.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-primary/35" />
          <div className="container mx-auto px-4 text-center relative">
            <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">
              {t("contact.hero-title")}
            </h1>
            <p className="text-balance text-xl opacity-90">
              {t("contact.hero-subtitle")}
            </p>
          </div>
        </section>

        {/* Reusable Contact Section */}
        <ContactSection lang={lang} />
      </div>
    </>
  );
}
