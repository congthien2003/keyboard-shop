import { getTranslations, createTranslator } from "@/lib/i18n-server";
import { AdsBanner } from "@/components/layout/ads-banner";
import { HeaderClient } from "./header-client";

type HeaderProps = {
  lang: "vi" | "en";
};

export async function Header({ lang }: HeaderProps) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const navItems = [
    { key: "home", href: "/", label: t("common.nav.home") },
    { key: "about", href: "/gioi-thieu", label: t("common.nav.about") },
    { key: "products", href: "/san-pham", label: t("common.nav.products") },
    { key: "news", href: "/tin-tuc", label: t("common.nav.news") },
    { key: "contact", href: "/lien-he", label: t("common.nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary text-primary-foreground shadow-[0_10px_30px_-22px_rgba(15,45,31,0.9)]">
      <AdsBanner lang={lang} />
      <HeaderClient
        lang={lang}
        navItems={navItems}
        brandName={t("common.brandName")}
        cartLabel={t("common.nav.cart")}
      />
    </header>
  );
}
