import { Metadata } from "next";
import {
  Locale,
  getTranslations,
  createTranslator,
  getLocale,
} from "@/lib/i18n-server";
import { COMPANY_INFO, SITE_URL } from "@/data/company-info";
import { NotFoundTracking } from "../../components/not-fund/not-found-tracking";
import { NotFoundContent } from "../../components/not-fund/not-found-content";

const baseUrl = SITE_URL;
const DEFAULT_LOCALE: Locale = "vi";

type Props = {
  params?: Promise<{ lang?: Locale }>;
};

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ lang?: Locale }>;
}): Promise<Metadata> {
  // Get lang from params or use default
  let lang: Locale = DEFAULT_LOCALE;

  try {
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams?.lang) {
        lang = resolvedParams.lang;
      }
    }
  } catch {
    // If params fails, use default locale
    lang = DEFAULT_LOCALE;
  }

  const isVi = lang === "vi";

  const title = isVi
    ? "404 - Trang không tìm thấy | SB-MechKey"
    : "404 - Page Not Found | SB-MechKey";
  const description = isVi
    ? "Trang bạn đang tìm kiếm không tồn tại. Vui lòng quay lại trang chủ hoặc xem các sản phẩm của chúng tôi."
    : "The page you are looking for does not exist. Please return to the home page or browse our products.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/404`,
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
  };
}

export default async function NotFound({ params }: Props) {
  // Get lang from params or use default
  let lang: Locale = DEFAULT_LOCALE;

  try {
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams?.lang) {
        lang = resolvedParams.lang;
      }
    }
  } catch {
    // If params fails, try to get from cookie
    try {
      lang = await getLocale();
    } catch {
      // If all fails, use default locale
      lang = DEFAULT_LOCALE;
    }
  }

  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Prepare translations for client component
  const notFoundTranslations = {
    message: t("notFound.message"),
    description: t("notFound.description"),
    goHome: t("notFound.goHome"),
    goProducts: t("notFound.goProducts"),
    searchProducts: t("notFound.searchProducts"),
    nav: {
      about: t("nav.about"),
      contact: t("nav.contact"),
    },
  };

  return (
    <>
      <NotFoundTracking />
      <NotFoundContent lang={lang} translations={notFoundTranslations} />
    </>
  );
}
