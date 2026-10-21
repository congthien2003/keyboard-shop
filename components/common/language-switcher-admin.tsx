"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcherAdmin() {
  const { locale, setLocale } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "en" ? "vi" : "en")}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{locale === "en" ? "EN" : "VIE"}</span>
    </Button>
  );
}
