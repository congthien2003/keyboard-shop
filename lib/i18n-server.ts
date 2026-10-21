import { cookies, headers } from "next/headers";
import fs from "fs";
import path from "path";
import type { Locale } from "./types";

export type { Locale };

interface Translations {
  [key: string]: any;
}

export async function getLocale(): Promise<Locale> {
  const routeLocale = (await headers()).get("x-shop-locale");
  if (routeLocale === "vi" || routeLocale === "en") return routeLocale;
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "en" ? "en" : "vi";
}

export async function getTranslations(locale: Locale): Promise<Translations> {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "locales",
      `${locale}.json`,
    );

    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Only log error if locale was valid (actual file read error)
    // Don't log for invalid locales as they're expected (static file requests)
    if (locale === "vi" || locale === "en") {
      console.error("Failed to load translations:", error);
    }
    return {};
  }
}

export function createTranslator(translations: Translations) {
  return function t(key: string, params?: Record<string, string>): string {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    let result = typeof value === "string" ? value : key;

    // Replace placeholders with params
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(
          new RegExp(`\\{${paramKey}\\}`, "g"),
          paramValue,
        );
      });
    }

    return result;
  };
}
