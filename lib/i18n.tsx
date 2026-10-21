"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Locale = "en" | "vi";

interface Translations {
  [key: string]: any;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("vi");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    // Load translations from multiple files
    const loadTranslations = async () => {
      try {
        const [translation] = await Promise.all([
          fetch(`/locales/${locale}.json`).then((res) => res.json()),
        ]);

        // Merge all translations
        const mergedTranslations = {
          ...translation,
        };

        setTranslations(mergedTranslations);
      } catch (err) {
        console.error("Failed to load translations:", err);
        // Fallback to old structure if new files don't exist
        fetch(`/locales/${locale}.json`)
          .then((res) => res.json())
          .then((data) => setTranslations(data))
          .catch((fallbackErr) =>
            console.error("Failed to load fallback translations:", fallbackErr),
          );
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string, params?: Record<string, string>): string => {
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

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
