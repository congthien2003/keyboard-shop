import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSlider } from "./hero-slider";
import Link from "next/link";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";

type Props = {
  lang: Locale;
};
export async function HeroSection({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.96_0.04_105),transparent_45%)]"
    >
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="storefront-eyebrow self-start">
              <Sparkles className="h-4 w-4" />
              <span>{t("home.hero.title")}</span>
            </p>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {t("home.hero.subtitle")}
            </h1>

            <p className="text-pretty text-lg text-muted-foreground md:text-xl">
              {t("home.hero.description")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={`/${lang}/lien-he`}>
                <Button
                  size="lg"
                  className="gap-2 text-base shadow-[0_12px_24px_-14px_oklch(0.3_0.07_155/0.8)]"
                >
                  {t("home.hero.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/${lang}/san-pham`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 bg-card/70 text-base hover:bg-secondary hover:text-secondary-foreground"
                >
                  {t("home.hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right slider */}
          <div className="relative">
            <HeroSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
