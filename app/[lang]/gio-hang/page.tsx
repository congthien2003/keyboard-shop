import { Metadata } from "next";
import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { COMPANY_INFO, SITE_URL } from "@/data/company-info";
import { CartPageClient } from "./components/cart-page-client";

const baseUrl = SITE_URL;

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

  const title = t("cart.title") + (isVi ? " - SB-MechKey" : " - SB-MechKey");
  const description = isVi
    ? "Giỏ hàng của bạn tại SB-MechKey - Xem và đặt hàng bàn phím và phụ kiện"
    : "Your cart at SB-MechKey - View and order mechanical keyboards";

  return {
    title,
    description,
    keywords: isVi
      ? "giỏ hàng, đặt hàng, mua hàng, SB-MechKey, bàn phím"
      : "cart, order, purchase, SB-MechKey, keyboards",
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/gio-hang`,
      siteName: isVi
        ? "SB-MechKey - Bàn Phím & Phụ Kiện"
        : "SB-MechKey - Keyboards & Accessories",
      images: [
        {
          url: `${baseUrl}/images/mechkey/logo.svg`,
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
      images: [`${baseUrl}/images/mechkey/logo.svg`],
    },
    alternates: {
      languages: {
        vi: `${baseUrl}/vi/gio-hang`,
        en: `${baseUrl}/en/gio-hang`,
        "x-default": `${baseUrl}/vi/gio-hang`,
      },
    },
  };
}

export default async function CartPage({ params }: Props) {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Server-side translations object to pass to client
  const clientTranslations = {
    title: t("cart.title"),
    empty: t("cart.empty"),
    orderInfo: t("cart.orderInfo"),
    name: t("cart.name"),
    phone: t("cart.phone"),
    email: t("cart.email"),
    address: t("cart.address"),
    note: t("cart.note"),
    subtotal: t("cart.subtotal"),
    shipping: t("cart.shipping"),
    total: t("cart.total"),
    placeOrder: t("cart.placeOrder"),
    processing: t("cart.processing"),
    remove: t("cart.remove"),
    success: t("cart.success"),
    summary: t("cart.summary"),
    error: {
      validation: t("cart.error.validation"),
      submit: t("cart.error.submit"),
      emptyCart: t("cart.error.emptyCart"),
      invalidItems: t("cart.error.invalidItems"),
      nameRequired: t("cart.error.nameRequired"),
      nameMinLength: t("cart.error.nameMinLength"),
      phoneRequired: t("cart.error.phoneRequired"),
      phoneInvalid: t("cart.error.phoneInvalid"),
      emailInvalid: t("cart.error.emailInvalid"),
      addressRequired: t("cart.error.addressRequired"),
      addressMinLength: t("cart.error.addressMinLength"),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <CartPageClient lang={lang} translations={clientTranslations} />
    </div>
  );
}
