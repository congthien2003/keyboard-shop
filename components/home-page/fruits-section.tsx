import { ProductResponse } from "@/services/product-service";
import { Locale, getTranslations, createTranslator } from "@/lib/i18n-server";
import { FruitsSectionClient } from "./fruits-section-client";

interface FruitsSectionProps {
  products: ProductResponse[];
  showNewBadge?: boolean;
  lang: Locale;
}

export async function FruitsSection({
  products,
  showNewBadge = true,
  lang,
}: FruitsSectionProps) {
  // Fetch translations on server
  const translations = await getTranslations(lang);
  const t = createTranslator(translations);

  // Get translated strings
  const title = t("home.defaultFruits.title");
  const subtitle = t("home.defaultFruits.subtitle");
  const viewAllText = t("home.defaultFruits.viewAll");
  const noProductsText = t("noProducts") || "Chưa có sản phẩm nào";

  // Pass translated strings to client component
  return (
    <FruitsSectionClient
      products={products}
      title={title}
      subtitle={subtitle}
      viewAllText={viewAllText}
      noProductsText={noProductsText}
      showNewBadge={showNewBadge}
      lang={lang}
    />
  );
}
