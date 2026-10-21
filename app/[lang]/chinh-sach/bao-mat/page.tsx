import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Database,
  UserCheck,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { COMPANY_INFO } from "@/data/company-info";
import { Metadata } from "next";

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

  const title = isVi
    ? "Chính Sách Bảo Mật - FreshFruit"
    : "Privacy Policy - FreshFruit";
  const description = isVi
    ? "Chính sách bảo mật thông tin của FreshFruit - Cam kết bảo vệ thông tin khách hàng"
    : "FreshFruit's privacy policy - Commitment to protect customer information";

  return {
    title,
    description,
    keywords: isVi
      ? "chính sách bảo mật, bảo mật, quyền riêng tư, FreshFruit"
      : "privacy policy, security, privacy, FreshFruit",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/chinh-sach/bao-mat`,
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
        vi: `${baseUrl}/vi/chinh-sach/bao-mat`,
        en: `${baseUrl}/en/chinh-sach/bao-mat`,
        "x-default": `${baseUrl}/vi/chinh-sach/bao-mat`,
      },
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { lang } = await params;
  const isVi = lang === "vi";
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const storeName = COMPANY_INFO.shortName;
  const companyName = COMPANY_INFO.name[lang];
  const taxCode = COMPANY_INFO.taxCode;
  const phone = COMPANY_INFO.contact.phone;
  const phoneFormatted = COMPANY_INFO.contact.phoneFormatted;
  const email = COMPANY_INFO.contact.email;
  const officeAddress = COMPANY_INFO.office.address[lang];

  // Structured data for privacy policy page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: isVi
      ? "Chính Sách Bảo Mật - FreshFruit"
      : "Privacy Policy - FreshFruit",
    description: isVi
      ? "Chính sách bảo mật thông tin của FreshFruit - Cam kết bảo vệ thông tin khách hàng"
      : "FreshFruit's privacy policy - Commitment to protect customer information",
    url: `${baseUrl}/${lang}/chinh-sach/bao-mat`,
    mainEntity: {
      "@type": "Organization",
      name: COMPANY_INFO.name.vi,
      contactPoint: {
        "@type": "ContactPoint",
        email: email,
        telephone: phone,
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
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  {t("policy.privacy.hero.badge")}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("policy.privacy.hero.title")}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("policy.privacy.hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <Card className="mb-8 border-2 border-green-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Lock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-600 mb-4">
                        {t("policy.privacy.commitment.title")}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.privacy.commitment.description", {
                          storeName,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section1.title")}
                  </h2>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {t("policy.privacy.section1.intro")}
                    </p>

                    <div className="bg-green-50 p-6 rounded-lg mb-4">
                      <h3 className="font-bold text-green-700 mb-3">
                        {t("policy.privacy.section1.collected.title")}
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.collected.name")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.collected.email")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.collected.phone")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.collected.address")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.collected.receiver")}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-lg">
                      <h3 className="font-bold text-amber-700 mb-3">
                        {t("policy.privacy.section1.usage.title")}
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.usage.delivery")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.usage.notification")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.usage.productInfo")}
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          <span className="text-gray-700">
                            {t("policy.privacy.section1.usage.orderProcessing")}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section2.title")}
                  </h2>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {t("policy.privacy.section2.description")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section3.title")}
                  </h2>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <p className="text-gray-700 leading-relaxed">
                          {t("policy.privacy.section3.computerData")}
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <p className="text-gray-700 leading-relaxed">
                          {t("policy.privacy.section3.personalData")}
                        </p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section4.title")}
                  </h2>
                </div>

                <Card className="border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <p className="text-lg font-bold text-green-600">
                        {companyName}
                      </p>
                      <div className="space-y-2 text-gray-700">
                        <p>
                          <strong>{t("footer.address")}:</strong>{" "}
                          {officeAddress}
                        </p>
                        <p>
                          <strong>
                            {t("policy.privacy.section4.taxCode")}
                          </strong>{" "}
                          {taxCode}
                        </p>
                        <p>
                          <strong>{t("policy.privacy.section4.phone")}</strong>{" "}
                          <a
                            href={`tel:${phone}`}
                            className="text-green-600 hover:underline"
                          >
                            {phoneFormatted}
                          </a>
                        </p>
                        <p>
                          <strong>{t("policy.privacy.section4.email")}</strong>{" "}
                          <a
                            href={`mailto:${email}`}
                            className="text-green-600 hover:underline"
                          >
                            {email}
                          </a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section 5 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section5.title")}
                  </h2>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {t("policy.privacy.section5.description", { storeName })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("policy.privacy.section6.title")}
                  </h2>
                </div>

                <Card className="border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.privacy.section6.intro", { storeName })}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.privacy.section6.policy", { storeName })}
                      </p>
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-gray-700 leading-relaxed">
                          {t("policy.privacy.section6.contact", { email })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Section */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t("policy.privacy.cta.title")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("policy.privacy.cta.description")}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      {t("policy.privacy.cta.callButton")}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      {t("policy.privacy.cta.emailButton")}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
