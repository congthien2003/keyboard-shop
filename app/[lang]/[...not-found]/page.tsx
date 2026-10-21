import { notFound } from "next/navigation";
import { Locale } from "@/lib/i18n-server";
import { getTranslations, createTranslator } from "@/lib/i18n-server";
import { NotFoundTracking } from "../../../components/not-fund/not-found-tracking";
import { NotFoundContent } from "../../../components/not-fund/not-found-content";

/**
 * Catch-all route to handle 404 for any route that doesn't exist
 * This ensures that our custom not-found.tsx is displayed for non-existent routes
 *
 * Note: This route matches any path with at least one segment after /[lang]
 * Static routes like /san-pham, /tin-tuc, etc. will be matched first, so they won't trigger this.
 * Only routes that don't match any existing route will trigger this catch-all.
 *
 * Examples:
 * - /vi/page-not-found -> slug = ['page-not-found'] -> trigger 404
 * - /vi/san-pham/invalid -> slug = ['san-pham', 'invalid'] -> trigger 404 (if route doesn't exist)
 */
type Props = {
  params: Promise<{ lang: Locale; slug: string[] }>;
};

export default async function CatchAll({ params }: Props) {
  const { lang } = await params;

  // Get translations
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Prepare translations for client component
  const notFoundTranslations = {
    message: t("common.notFound.message"),
    description: t("common.notFound.description"),
    goHome: t("common.notFound.goHome"),
    goProducts: t("common.notFound.goProducts"),
    searchProducts: t("common.notFound.searchProducts"),
    nav: {
      about: t("common.nav.about"),
      contact: t("common.nav.contact"),
    },
  };

  // Render 404 page directly instead of calling notFound()
  // This ensures we have access to lang parameter
  return (
    <>
      <NotFoundTracking />
      <NotFoundContent lang={lang} translations={notFoundTranslations} />
    </>
  );
}
