import type { Locale } from "@/lib/types";

interface ProductsHeroProps {
  lang: Locale;
  txt: {
    title: string;
    subtitle: string;
  };
}

export function ProductsHero({ lang, txt }: ProductsHeroProps) {
  return (
    <section
      className="relative overflow-hidden py-32 text-primary-foreground md:py-40"
      style={{
        backgroundImage: "url(/images/mechkey/keyboard.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-primary/35" />
      <div className="container mx-auto px-4 text-center relative">
        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">
          {txt.title}
        </h1>
        <p className="text-balance text-xl opacity-90">{txt.subtitle}</p>
      </div>
    </section>
  );
}
