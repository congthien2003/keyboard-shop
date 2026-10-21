import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Leaf,
  Heart,
  Users,
  Award,
  Shield,
  CheckCircle,
  Truck,
  Star,
  Calendar,
  TrendingUp,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Locale, createTranslator, getTranslations } from "@/lib/i18n-server";
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
    ? "Giới Thiệu - FreshFruit | Trái Cây Tươi Ngon"
    : "About Us - FreshFruit | Premium Fresh Fruits";
  const description = isVi
    ? `Tìm hiểu về ${t("about.title")} - ${t("about.subtitle")}`
    : `Learn about ${t("about.title")} - ${t("about.subtitle")}`;

  return {
    title,
    description,
    keywords: isVi
      ? "giới thiệu, FreshFruit, trái cây, về chúng tôi, công ty trái cây"
      : "about, FreshFruit, fruits, about us, fruit company",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/gioi-thieu`,
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
        vi: `${baseUrl}/vi/gioi-thieu`,
        en: `${baseUrl}/en/gioi-thieu`,
        "x-default": `${baseUrl}/vi/gioi-thieu`,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const isVi = lang === "vi";
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const values = [
    {
      icon: Award,
      title: t("about.values.quality.title"),
      description: t("about.values.quality.description"),
    },
    {
      icon: Leaf,
      title: t("about.values.sustainability.title"),
      description: t("about.values.sustainability.description"),
    },
    {
      icon: Users,
      title: t("about.values.community.title"),
      description: t("about.values.community.description"),
    },
  ];

  // Structured data for about page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: isVi ? "Giới Thiệu - FreshFruit" : "About Us - FreshFruit",
    description: isVi
      ? `Tìm hiểu về ${t("about.title")} - ${t("about.subtitle")}`
      : `Learn about ${t("about.title")} - ${t("about.subtitle")}`,
    url: `${baseUrl}/${lang}/gioi-thieu`,
    mainEntity: {
      "@type": "Organization",
      name: COMPANY_INFO.name.vi,
      alternateName: COMPANY_INFO.name.en,
      url: baseUrl,
      logo: `${baseUrl}/images/logo-khangmy.webp`,
      description: isVi
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
      <div className="storefront-content-page min-h-screen bg-background">
        {/* Hero Section */}
        <section
          className="relative py-40 text-primary-foreground"
          style={{
            backgroundImage: "url(/images/hero-banner-14.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-primary/35" />
          <div className="container mx-auto px-4 text-center relative">
            <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">
              {t("about.title")}
            </h1>
            <p className="text-balance text-xl opacity-90">
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("about.whyChoose.title")}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("about.whyChoose.subtitle")}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {t("about.whyChoose.item1.question")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {t("about.whyChoose.item1.answer")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {t("about.whyChoose.item2.question")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {t("about.whyChoose.item2.answer")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {t("about.whyChoose.item3.question")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {t("about.whyChoose.item3.answer")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {t("about.whyChoose.item4.question")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {t("about.whyChoose.item4.answer")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("about.banner.title")}
              </h2>
              <p className="text-xl mb-6 opacity-90">
                {t("about.banner.subtitle")}
              </p>
              <p className="text-lg mb-8 opacity-80">
                {t("about.banner.description")}
              </p>
              <Button size="lg" variant="secondary" className="text-primary">
                <Link href={`/${lang}/lien-he`}>{t("about.banner.cta")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quality Commitment Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("about.qualityCommitment.title")}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t("about.qualityCommitment.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.qualityCommitment.item1.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.qualityCommitment.item1.description")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.qualityCommitment.item2.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.qualityCommitment.item2.description")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Star className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.qualityCommitment.item3.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.qualityCommitment.item3.description")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Truck className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.qualityCommitment.item4.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.qualityCommitment.item4.description")}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t("about.story.title")}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {t("about.story.subtitle")}
                </p>
              </div>

              <div className="mb-12">
                <p className="text-lg leading-relaxed text-muted-foreground text-center">
                  {t("about.story.content")}
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
                <div className="space-y-8">
                  {/* 2015 */}
                  <div className="relative flex items-center flex-row">
                    <div className="w-1/2 pr-8 text-right">
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <Globe className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">
                            {t("about.story.milestone1.year")}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {t("about.story.milestone1.title")}
                        </h3>
                        <p className="text-muted-foreground">
                          {t("about.story.milestone1.description")}
                        </p>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>

                  {/* 2018 */}
                  <div className="relative flex items-center flex-row-reverse">
                    <div className="w-1/2 pl-8 text-left">
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">
                            {t("about.story.milestone2.year")}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {t("about.story.milestone2.title")}
                        </h3>
                        <p className="text-muted-foreground">
                          {t("about.story.milestone2.description")}
                        </p>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>

                  {/* 2020 */}
                  <div className="relative flex items-center flex-row">
                    <div className="w-1/2 pr-8 text-right">
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <Smartphone className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">
                            {t("about.story.milestone3.year")}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {t("about.story.milestone3.title")}
                        </h3>
                        <p className="text-muted-foreground">
                          {t("about.story.milestone3.description")}
                        </p>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>

                  {/* 2025 */}
                  <div className="relative flex items-center flex-row-reverse">
                    <div className="w-1/2 pl-8 text-left">
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <Heart className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">
                            {t("about.story.milestone4.year")}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {t("about.story.milestone4.title")}
                        </h3>
                        <p className="text-muted-foreground">
                          {t("about.story.milestone4.description")}
                        </p>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-balance text-center text-3xl font-bold">
              {t("about.values.title")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card p-6 text-center shadow-sm"
                >
                  <value.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-3 text-balance text-xl font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-pretty text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
