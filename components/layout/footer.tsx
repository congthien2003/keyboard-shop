import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
import Link from "next/link";
import Image from "next/image";

type FooterProps = {
  lang: Locale;
};

export async function Footer({ lang }: FooterProps) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const quickLinks = [
    { key: "home", href: "/" },
    { key: "about", href: "/gioi-thieu" },
    { key: "products", href: "/san-pham" },
    { key: "news", href: "/tin-tuc" },
    { key: "contact", href: "/lien-he" },
  ];

  const policyLinks = [
    { key: "privacy", href: "/chinh-sach/bao-mat" },
    { key: "delivery", href: "/chinh-sach/giao-hang" },
    { key: "orderGuide", href: "/chinh-sach/huong-dan-dat-hang" },
  ];

  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-start">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            {/* Brand */}
            <div className="min-h-[2rem] flex items-center">
              <Link
                href={`/${lang}`}
                className="flex w-fit items-center gap-3 rounded-xl transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
              >
                <Image
                  src="/images/logo-khangmy.webp"
                  alt="Logo"
                  width={60}
                  height={60}
                />
                <span className="text-lg font-bold">
                  {t("common.brandName")}
                </span>
              </Link>
            </div>

            {/* Slogan */}
            <p className="text-pretty text-sm text-primary-foreground/80">
              {t("common.footer.description")}
            </p>

            <p className="space-y-2 text-sm text-primary-foreground/80">
              <strong>{t("common.footer.phone")}:</strong>{" "}
              {t("common.footer.branchPhone")}
            </p>
            <p className="space-y-2 text-sm text-primary-foreground/80">
              <strong>{t("common.footer.email")}:</strong>{" "}
              <a
                href={`mailto:${t("common.footer.emailValue")}`}
                className="hover:underline"
              >
                {t("common.footer.emailValue")}
              </a>
            </p>

            {/* Separator */}
            <hr className="border-primary-foreground/20"></hr>

            {/* Main Company Info */}
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p className="font-semibold">{t("common.footer.companyName")}</p>
              <p>
                <strong>{t("common.footer.taxCode")}:</strong>{" "}
                {t("common.footer.companyTaxCode")}
              </p>
              <p>
                <strong>{t("common.footer.address")}:</strong>{" "}
                {t("common.footer.companyAddress")}
              </p>
            </div>

            {/* Separator */}
            <hr className="border-primary-foreground/20"></hr>

            {/* Branch Info */}
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p className="font-semibold">{t("common.footer.branchName")}</p>
              <p>
                <strong>{t("common.footer.taxCode")}:</strong>{" "}
                {t("common.footer.branchTaxCode")}
              </p>
              <p>
                <strong>{t("common.footer.address")}:</strong>{" "}
                {t("common.footer.branchAddress")}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold min-h-[2rem] flex items-center">
              {t("common.footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={`/${lang}${link.href}`}
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-accent focus-visible:text-accent"
                  >
                    {t(`common.nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policy Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold min-h-[2rem] flex items-center">
              {t("common.footer.policies")}
            </h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-accent focus-visible:text-accent"
                  >
                    {t(`common.footer.policy.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div className="space-y-6">
            {/* Social */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold min-h-[2rem] flex items-center">
                {t("common.footer.followUs")}
              </h3>
            </div>

            {/* Facebook Page */}
            <div className="space-y-4">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fkhangmy.fruit&tabs&width=340&height=200&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=3046323358944801"
                width="340"
                height="200"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="w-full overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="">
          {/* Google Maps */}
          <div className="mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d244.9904945566188!2d106.6265666!3d10.7462024!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d00287463f9%3A0xc6c02f8c4c8df5af!2sCty%20TNHH%20TM-DV%20Khang%20M%E1%BB%B9!5e0!3m2!1svi!2s!4v1760627224823!5m2!1svi!2s"
              width="100%"
              height="300"
              loading="lazy"
              className="rounded-2xl border border-primary-foreground/10"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/80">
            {t("common.footer.copyright")}
          </p>
          <p className="text-sm text-primary-foreground/80 mt-2">
            {t("common.footer.companyInfo")}
          </p>
          <p className="text-sm text-primary-foreground/80">
            {t("common.footer.operationDate")}
          </p>
        </div>
      </div>
    </footer>
  );
}
