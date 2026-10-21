import Image from "next/image";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
import { CustomersAnimation } from "./customers-animation";
type Props = {
  lang: Locale;
};
export async function CustomersServer({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const customers = [
    {
      name: "AEON",
      logo: "/images/aeon-logo.webp?height=80&width=160",
    },
    {
      name: "Genshai",
      logo: "/images/genshai-market.webp?height=80&width=160",
    },
    {
      name: "Ksmart",
      logo: "/images/ksmart.webp?height=80&width=160",
    },
    {
      name: "Circle K",
      logo: "/images/circle-k-logo.webp?height=80&width=160",
    },
    {
      name: "Cheers",
      logo: "/images/cheers-logo.webp?height=80&width=160",
    },
    {
      name: "Coop Food",
      logo: "/images/coopfood-logo.webp?height=80&width=160",
    },
  ];

  const partners = [
    {
      name: "AEON",
      logo: "/images/aeon-logo.webp?height=80&width=160",
    },
    {
      name: "Genshai",
      logo: "/images/genshai-market.webp?height=80&width=160",
    },
    {
      name: "Ksmart",
      logo: "/images/ksmart.webp?height=80&width=160",
    },
    {
      name: "Circle K",
      logo: "/images/circle-k-logo.webp?height=80&width=160",
    },
    {
      name: "Cheers",
      logo: "/images/cheers-logo.webp?height=80&width=160",
    },
    {
      name: "Coop Food",
      logo: "/images/coopfood-logo.webp?height=80&width=160",
    },
    {
      name: "BenThanhInvoice",
      logo: "/images/bt-invoice.webp?height=80&width=160",
    },
    {
      name: "Misa",
      logo: "/images/misa-logo.webp?height=80&width=160",
    },
  ];

  return (
    <>
      <CustomersAnimation />
      <section className="storefront-section storefront-section-muted relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="storefront-eyebrow mb-6">
              <div className="pulse-dot h-2.5 w-2.5 rounded-full bg-accent"></div>
              <span className="text-sm font-semibold uppercase tracking-wide">
                {t("home.customers.badge") || "Đối Tác Tin Cậy"}
              </span>
            </div>
            <h2 className="storefront-heading mb-6">
              <span>
                {t("home.customers.title")}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("home.customers.subtitle")}
            </p>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {customers.map((customer, index) => (
              <div
                key={index}
                className="customer-card group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Card wrapper with 3D effect */}
                <div className="storefront-card storefront-card-interactive relative flex min-h-[160px] items-center justify-center p-8">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Shine effect */}
                  <div className="hidden">
                    <div className="absolute -top-full left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent transform translate-y-0 group-hover:translate-y-full transition-transform duration-1000"></div>
                  </div>

                  {/* Logo container */}
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={customer.logo}
                      alt={customer.name}
                      width={160}
                      height={80}
                      className="object-contain max-h-20 w-auto filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 brightness-90 group-hover:brightness-100"
                    />
                  </div>

                  {/* Corner decorations */}
                  <div className="hidden"></div>
                  <div className="hidden"></div>

                  {/* Tooltip with customer name */}
                  <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {customer.name}
                    <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Partners Section */}
          <div className="text-center mb-16 mt-24">
            <h2 className="storefront-heading mb-6">
              <span>
                {t("home.partners.title")}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("home.partners.subtitle")}
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center mb-20">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="partner-card group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Card wrapper with 3D effect */}
                <div className="storefront-card storefront-card-interactive relative flex min-h-[160px] items-center justify-center p-8">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Shine effect */}
                  <div className="hidden">
                    <div className="absolute -top-full left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent transform translate-y-0 group-hover:translate-y-full transition-transform duration-1000"></div>
                  </div>

                  {/* Logo container */}
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={160}
                      height={80}
                      className="object-contain max-h-20 w-auto filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 brightness-90 group-hover:brightness-100"
                    />
                  </div>

                  {/* Corner decorations */}
                  <div className="hidden"></div>
                  <div className="hidden"></div>

                  {/* Tooltip with partner name */}
                  <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {partner.name}
                    <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom decoration - Customers Stats */}
          <div className="mt-20 text-center">
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">50+</span>
                </div>
                <span className="text-sm font-medium">
                  {t("home.customers.stats.partners")}
                </span>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">
                    10+
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {t("home.customers.stats.yearsExperience")}
                </span>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">100%</span>
                </div>
                <span className="text-sm font-medium">
                  {t("home.customers.stats.trust")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
