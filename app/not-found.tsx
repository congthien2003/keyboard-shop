import { Locale } from "@/lib/i18n-server";
import {
  getTranslations,
  createTranslator,
  getLocale,
} from "@/lib/i18n-server";
import { NotFoundTracking } from "@/components/not-fund/not-found-tracking";
import { NotFoundContent } from "@/components/not-fund/not-found-content";

const DEFAULT_LOCALE: Locale = "vi";

/**
 * Root not-found: used when Next.js renders 404 for routes outside [lang] (e.g. /unknown).
 * Params may be undefined when Next invokes this file, so we resolve lang safely.
 */
type Props = {
  params?: Promise<{ lang?: Locale; slug?: string[] }>;
};

export default async function RootNotFound({ params }: Props) {
  let lang: Locale = DEFAULT_LOCALE;
  try {
    const resolved = await params;
    if (resolved?.lang === "vi" || resolved?.lang === "en")
      lang = resolved.lang;
  } catch {
    try {
      lang = await getLocale();
    } catch {
      lang = DEFAULT_LOCALE;
    }
  }

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
