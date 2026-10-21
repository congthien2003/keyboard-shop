import { getTranslations, createTranslator, Locale } from "@/lib/i18n-server";
import { ContactSectionClient } from "./contact-section-client";
import { COMPANY_INFO } from "@/data/company-info";

type Props = {
  lang: Locale;
};

export async function ContactSection({ lang }: Props) {
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Prepare the text props object for the client component
  const txt = {
    title: t("contact.title"),
    subtitle: t("contact.subtitle"),
    formTitle: t("contact.formTitle"),
    info: {
      title: t("contact.info.title"),
      address: COMPANY_INFO.office.address[lang],
      phone: COMPANY_INFO.contact.phone,
      email: COMPANY_INFO.contact.email,
      hours: "",
    },
    placeholders: {
      name: t("contact.name"),
      phone: t("contact.phone"),
      email: t("contact.email"),
      message: t("contact.message"),
    },
    errors: {
      nameRequired: t("contact.error.nameRequired"),
      nameMinLength: t("contact.error.nameMinLength"),
      emailRequired: t("contact.error.emailRequired"),
      emailInvalid: t("contact.error.emailInvalid"),
      phoneRequired: t("contact.error.phoneRequired"),
      phoneInvalid: t("contact.error.phoneInvalid"),
      messageRequired: t("contact.error.messageRequired"),
      messageMinLength: t("contact.error.messageMinLength"),
      validation: t("contact.error.validation"),
      submit: t("contact.error.submit"),
    },
    cta: {
      submit: t("contact.submit"),
      submitting: t("contact.submitting"),
    },
    successMessage: t("contact.success"),
  };

  const href = {
    phone: `tel:${COMPANY_INFO.contact.phone}`,
    email: `mailto:${COMPANY_INFO.contact.email}`,
  };

  return <ContactSectionClient txt={txt} href={href} />;
}
