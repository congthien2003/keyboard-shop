interface NewsHeroProps {
  title: string;
  subtitle: string;
}

export function NewsHero({ title, subtitle }: NewsHeroProps) {
  return (
    <section
      className="relative overflow-hidden py-32 text-primary-foreground md:py-40"
      style={{
        backgroundImage: "url(/images/hero-banner-10.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-primary/35" />
      <div className="container mx-auto px-4 text-center relative">
        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        <p className="text-balance text-xl opacity-90">{subtitle}</p>
      </div>
    </section>
  );
}

export default NewsHero;
