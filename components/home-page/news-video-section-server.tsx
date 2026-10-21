import { NewsData } from "@/types/news";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
import { NewsScrollClient } from "./news-scroll-client";

interface NewsVideoSectionServerProps {
  newsList: NewsData[];
  lang: Locale;
}

export async function NewsVideoSectionServer({
  newsList,
  lang,
}: NewsVideoSectionServerProps) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  return (
    <section className="storefront-section storefront-section-muted">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="storefront-heading mb-4">
            {t("home.newsVideo.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.newsVideo.subtitle")}
          </p>
        </div>

        <div className="">
          {/* Left Side - News */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-semibold text-foreground">
                {t("home.newsVideo.news")}
              </h3>
              <div className="h-1 w-12 bg-primary rounded-full" />
            </div>

            {/* News Display - Auto Scrolling List */}
            <NewsScrollClient newsList={newsList} locale={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
