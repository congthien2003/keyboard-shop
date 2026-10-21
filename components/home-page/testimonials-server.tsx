import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
type Props = {
  lang: Locale;
};
export async function TestimonialsServer({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const testimonials = [
    {
      name: t("common.testimonials.customer1.name"),
      role: t("common.testimonials.customer1.role"),
      content: t("common.testimonials.customer1.content"),
      rating: 5,
      avatar:
        "https://tse1.explicit.bing.net/th/id/OIP.cypdbkPjMZ74AIkMBOvmIAAAAA?w=408&h=420&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      name: t("common.testimonials.customer2.name"),
      role: t("common.testimonials.customer2.role"),
      content: t("common.testimonials.customer2.content"),
      rating: 5,
      avatar:
        "https://tse2.mm.bing.net/th/id/OIP.98rrJNBSqC-Vf7ol9bbzZAHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      name: t("common.testimonials.customer3.name"),
      role: t("common.testimonials.customer3.role"),
      content: t("common.testimonials.customer3.content"),
      rating: 5,
      avatar:
        "https://tse3.mm.bing.net/th/id/OIP.Jm2vdsuLDxYKS9j5PydeOwHaHa?cb=12&w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ];

  return (
    <section className="storefront-section storefront-section-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="storefront-heading mb-4">
            {t("common.testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("common.testimonials.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="storefront-card storefront-card-interactive p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-foreground/80 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
