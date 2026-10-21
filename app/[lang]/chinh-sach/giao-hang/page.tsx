import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Package,
  MapPin,
  DollarSign,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  AlertCircle,
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
    ? "Chính Sách Giao Hàng - FreshFruit"
    : "Shipping Policy - FreshFruit";
  const description = isVi
    ? "Tìm hiểu về chính sách giao hàng của FreshFruit - Giao hàng nhanh chóng, an toàn và đáng tin cậy"
    : "Learn about FreshFruit's shipping policy - Fast, safe and reliable delivery";

  return {
    title,
    description,
    keywords: isVi
      ? "chính sách giao hàng, giao hàng, vận chuyển, FreshFruit"
      : "shipping policy, delivery, shipping, FreshFruit",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/chinh-sach/giao-hang`,
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
        vi: `${baseUrl}/vi/chinh-sach/giao-hang`,
        en: `${baseUrl}/en/chinh-sach/giao-hang`,
        "x-default": `${baseUrl}/vi/chinh-sach/giao-hang`,
      },
    },
  };
}

export default async function ShippingPolicyPage({ params }: Props) {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const storeName = COMPANY_INFO.shortName;
  const phone = COMPANY_INFO.contact.phone;
  const email = COMPANY_INFO.contact.email;

  return (
    <div className="storefront-content-page min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {t("policy.shipping.hero.badge")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("policy.shipping.hero.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("policy.shipping.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction - Shipping Fees */}
            <Card className="mb-8 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-4">
                      {t("policy.shipping.fees.title")}
                    </h2>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.fees.freeShipping")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                    <Package className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.fees.standardFee")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section I - Shipping Policy */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("policy.shipping.policy.title")}
                </h2>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.policy.freeShipping")}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.policy.standardFee")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section II - Return Policy */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <RefreshCcw className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("policy.shipping.return.title")}
                </h2>
              </div>

              {/* Before Receiving */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600">
                      {t("policy.shipping.return.beforeReceiving.title")}
                    </h3>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {t("policy.shipping.return.beforeReceiving.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* After Receiving */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-600">
                      {t("policy.shipping.return.afterReceiving.title")}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Requirement */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 leading-relaxed">
                          {t(
                            "policy.shipping.return.afterReceiving.requirement",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Customer's fault */}
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        {t(
                          "policy.shipping.return.afterReceiving.customerFault.title",
                        )}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t(
                          "policy.shipping.return.afterReceiving.customerFault.description",
                        )}
                      </p>
                      <ul className="mt-2 space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">
                            {t(
                              "policy.shipping.return.afterReceiving.customerFault.condition1",
                            )}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">
                            {t(
                              "policy.shipping.return.afterReceiving.customerFault.condition2",
                            )}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">
                            {t(
                              "policy.shipping.return.afterReceiving.customerFault.condition3",
                            )}
                          </span>
                        </li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        {t(
                          "policy.shipping.return.afterReceiving.customerFault.note",
                        )}
                      </p>
                    </div>

                    {/* Store's fault */}
                    <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                      <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        {t(
                          "policy.shipping.return.afterReceiving.storeFault.title",
                        )}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t(
                          "policy.shipping.return.afterReceiving.storeFault.description",
                        )}
                      </p>
                    </div>

                    {/* Refund */}
                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                      <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {t(
                          "policy.shipping.return.afterReceiving.refund.title",
                        )}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {t(
                          "policy.shipping.return.afterReceiving.refund.description",
                        )}
                      </p>
                    </div>

                    {/* Time limit */}
                    <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                      <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t(
                          "policy.shipping.return.afterReceiving.timeLimit.title",
                        )}
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700 flex items-center gap-2">
                          <span className="font-semibold text-purple-600">
                            {t(
                              "policy.shipping.return.afterReceiving.timeLimit.fresh",
                            )}
                          </span>
                        </p>
                        <p className="text-gray-700 flex items-center gap-2">
                          <span className="font-semibold text-purple-600">
                            {t(
                              "policy.shipping.return.afterReceiving.timeLimit.other",
                            )}
                          </span>
                        </p>
                        <p className="text-gray-600 text-sm italic">
                          {t(
                            "policy.shipping.return.afterReceiving.timeLimit.note",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact for Return */}
              <Card className="border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600">
                      {t("policy.shipping.return.contact.title")}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.return.contact.visitStore")}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t("policy.shipping.return.contact.hotline", {
                          phone,
                          storeName,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {t("policy.shipping.summary.title")}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-bold text-green-600">
                        {t("policy.shipping.summary.accepted.title")}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.accepted.item1")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.accepted.item2")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.accepted.item3")}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-bold text-red-600">
                        {t("policy.shipping.summary.rejected.title")}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.rejected.item1")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.rejected.item2")}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                        <span>
                          {t("policy.shipping.summary.rejected.item3")}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("policy.shipping.cta.title")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("policy.shipping.cta.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {t("policy.shipping.cta.callButton")}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {t("policy.shipping.cta.emailButton")}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
