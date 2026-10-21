import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
type Props = {
  lang: Locale;
};
export async function FAQServer({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  const faqs = [
    {
      question: t("common.faq.q1.question"),
      answer: t("common.faq.q1.answer"),
    },
    {
      question: t("common.faq.q2.question"),
      answer: t("common.faq.q2.answer"),
    },
    {
      question: t("common.faq.q3.question"),
      answer: t("common.faq.q3.answer"),
    },
    {
      question: t("common.faq.q4.question"),
      answer: t("common.faq.q4.answer"),
    },
    {
      question: t("common.faq.q5.question"),
      answer: t("common.faq.q5.answer"),
    },
  ];

  return (
    <section className="storefront-section bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="storefront-heading mb-4">
            {t("common.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("common.faq.subtitle")}</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
