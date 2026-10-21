import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Locale } from "@/lib/i18n-server";
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        lang === "en"
          ? (window.location.href = `/vi/${window.location.pathname
              .split("/")
              .slice(2)
              .join("/")}`)
          : (window.location.href = `/en/${window.location.pathname
              .split("/")
              .slice(2)
              .join("/")}`)
      }
      className="gap-2 border border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-primary-foreground/60"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{lang === "en" ? "EN" : "VI"}</span>
    </Button>
  );
}
