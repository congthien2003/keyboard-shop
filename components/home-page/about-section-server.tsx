import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
type Props = {
  lang: Locale;
};
export async function AboutSectionServer({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  return (
    <section id="about" className="storefront-section storefront-section-muted">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-primary/10 shadow-[0_20px_48px_-28px_oklch(0.3_0.07_155/0.55)]">
              <Image
                src="/images/hero-banner-4.webp?height=600&width=800"
                alt="About us"
                className="h-full w-full object-cover"
                width={800}
                height={600}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="storefront-heading">
              {t("about.title")}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("about.description")}
            </p>
            <Card className="storefront-card border-l-4 border-l-primary bg-card/80">
              <CardContent className="p-6">
                <p className="text-pretty font-medium leading-relaxed">
                  {t("about.mission")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
