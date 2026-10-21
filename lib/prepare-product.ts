import { ProductResponse } from "@/services/product-service";
import { formatUsd, formatVnd } from "@/lib/formatAmount";

export interface PreparedProduct {
  product: ProductResponse;
  name: string;
  originText: string;
  priceDisplay: string;
}

interface TranslationFunction {
  (key: string): string;
}

export function prepareProduct(
  product: ProductResponse,
  lang: "vi" | "en",
  t: TranslationFunction,
): PreparedProduct {
  const currentTranslate = product.translates.find((tr) => tr.lang === lang);
  const name = currentTranslate?.name || "";
  const originText = `${t("origin")}: ${currentTranslate?.fromCountry || ""}`;

  const priceDisplay = (() => {
    if (product.status !== 3) {
      return t("admin.products.statusContact");
    }
    if (lang === "vi") {
      const viTranslate = product.translates.find((tr) => tr.lang === "vi");
      return formatVnd(viTranslate?.price || 0);
    } else {
      const enTranslate = product.translates.find((tr) => tr.lang === "en");
      return formatUsd(enTranslate?.price || 0);
    }
  })();

  return {
    product,
    name,
    originText,
    priceDisplay,
  };
}

export function prepareProducts(
  products: ProductResponse[],
  lang: "vi" | "en",
  t: TranslationFunction,
): PreparedProduct[] {
  return products.map((product) => prepareProduct(product, lang, t));
}
